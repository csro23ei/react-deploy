import React, { useEffect, useState } from 'react';
import './App.css';

const LOCAL_URL = 'http://localhost:8080/todos';
const REMOTE_URL = 'https://what-in-the-holy-f-f2m3p.ondigitalocean.app/';

function App() {
    const [todos, setTodos] = useState([]);
    const [selected, setSelected] = useState({});
    const [newTodo, setNewTodo] = useState('');

    useEffect(() => {
        fetchTodos();
    }, []);

    // Hämtar todos från båda endpoints och slår ihop dem
    const fetchTodos = () => {
        Promise.all([
                fetch(LOCAL_URL).then((res) => res.json()),
                fetch(REMOTE_URL).then((res) => res.json())
            ])
            .then(([localTodos, remoteTodos]) => {
                setTodos([...localTodos, ...remoteTodos]);
            })
            .catch((error) => {
                console.error('Fel vid hämtning av todos:', error);
                // Fallback - försök hämta från lokal bara
                fetch(LOCAL_URL)
                    .then((res) => res.json())
                    .then((data) => setTodos(data));
            });
    };

    // Hjälpfunktion för att göra samma fetch-anrop till båda servrar
    const fetchBoth = (urlPath, options) => {
        return Promise.all([
            fetch(`${LOCAL_URL}${urlPath}`, options),
            fetch(`${REMOTE_URL}${urlPath}`, options)
        ]);
    };

    const handleCheckboxChange = (id) => {
        setSelected((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleMarkCompleted = () => {
        const updates = todos.filter((todo) => selected[todo.id]);
        const promises = updates.map((todo) =>
            fetchBoth(`/${todo.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({...todo, completed: true }),
            })
        );

        Promise.all(promises)
            .then(() => {
                fetchTodos();
                setSelected({});
            })
            .catch((error) => console.error('Fel vid markering som klar:', error));
    };

    const handleAddTodo = () => {
        if (!newTodo.trim()) return;

        const newTodoObj = { title: newTodo, completed: false };

        Promise.all([
                fetch(LOCAL_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newTodoObj),
                }),
                fetch(REMOTE_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newTodoObj),
                }),
            ])
            .then(() => {
                setNewTodo('');
                fetchTodos();
            })
            .catch((error) => console.error('Fel vid tillägg av todo:', error));
    };

    const handleDelete = (id) => {
        Promise.all([
                fetch(`${LOCAL_URL}/${id}`, { method: 'DELETE' }),
                fetch(`${REMOTE_URL}/${id}`, { method: 'DELETE' }),
            ])
            .then(() => fetchTodos())
            .catch((error) => console.error('Fel vid borttagning:', error));
    };

    return ( <
        div className = "App" >
        <
        h1 > Todo - lista < /h1>

        <
        div style = {
            { marginBottom: '20px' } } >
        <
        input type = "text"
        value = { newTodo }
        placeholder = "Ny uppgift"
        onChange = {
            (e) => setNewTodo(e.target.value) }
        /> <
        button onClick = { handleAddTodo }
        style = {
            { marginLeft: '10px' } } >
        Lägg till <
        /button> <
        /div>

        <
        ul > {
            todos.map((todo) => ( <
                li key = { todo.id }
                style = {
                    { marginBottom: '10px' } } >
                <
                input type = "checkbox"
                disabled = { todo.completed }
                checked = {!!selected[todo.id] }
                onChange = {
                    () => handleCheckboxChange(todo.id) }
                /> <
                span style = {
                    {
                        textDecoration: todo.completed ? 'line-through' : 'none',
                        marginLeft: '10px',
                    }
                } >
                { todo.title } <
                /span> <
                button onClick = {
                    () => handleDelete(todo.id) }
                style = {
                    {
                        marginLeft: '10px',
                        background: 'red',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }
                } >
                Ta bort <
                /button> <
                /li>
            ))
        } <
        /ul>

        <
        button onClick = { handleMarkCompleted } > Klar < /button> <
        /div>
    );
}

export default App;