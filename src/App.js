import React, { useEffect, useState } from 'react';
import './App.css';

const REMOTE_URL = 'https://what-in-the-holy-f-f2m3p.ondigitalocean.app/todos';

function App() {
    const [todos, setTodos] = useState([]);
    const [selected, setSelected] = useState({});
    const [newTodo, setNewTodo] = useState('');

    useEffect(() => {
        fetchTodos();
    }, []);

    // Hämtar todos från remote endpoint
    const fetchTodos = () => {
        fetch(REMOTE_URL)
            .then((res) => res.json())
            .then((data) => setTodos(data))
            .catch((error) => {
                console.error('Fel vid hämtning av todos:', error);
            });
    };

    // Hjälpfunktion för fetch-anrop till remote server
    const fetchRemote = (urlPath, options) => {
        return fetch(`${REMOTE_URL}${urlPath}`, options);
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
            fetchRemote(`/${todo.id}`, {
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

        fetchRemote('', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTodoObj),
            })
            .then(() => {
                setNewTodo('');
                fetchTodos();
            })
            .catch((error) => console.error('Fel vid tillägg av todo:', error));
    };

    const handleDelete = (id) => {
        fetchRemote(`/${id}`, { method: 'DELETE' })
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