import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
    const [todos, setTodos] = useState([]);
    const [selected, setSelected] = useState({});
    const [newTodo, setNewTodo] = useState('');

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = () => {
        fetch('http://localhost:8080/todos')
            .then((res) => res.json())
            .then((data) => setTodos(data));
    };

    const handleCheckboxChange = (id) => {
        setSelected((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleMarkCompleted = () => {
        const updates = todos.filter((todo) => selected[todo.id]);
        updates.forEach((todo) => {
            fetch(`http://localhost:8080/todos/${todo.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({...todo, completed: true }),
            }).then(fetchTodos);
        });
        setSelected({});
    };

    const handleAddTodo = () => {
        if (!newTodo.trim()) return;

        fetch('http://localhost:8080/todos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: newTodo, completed: false }),
            })
            .then((res) => res.json())
            .then(() => {
                setNewTodo('');
                fetchTodos();
            });
    };

    const handleDelete = (id) => {
        fetch(`http://localhost:8080/todos/${id}`, {
            method: 'DELETE',
        }).then(fetchTodos);
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