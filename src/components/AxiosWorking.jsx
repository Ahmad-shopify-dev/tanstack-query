import axios, { formToJSON, toFormData } from 'axios'
import React, { useEffect } from 'react'
import api from '../services/api';



function AxiosWorking() {

    const controller = new AbortController();
    const token = 'some_token';
    const usersApi = axios.create({
        baseURL: 'https://jsonplaceholder.typicode.com',
        adapter: ['fetch', 'http', 'xhr'],
        // HERE YOU CAN CHECK AUTH
        // auth: {
        //     username: "something",
        //     password: "something"
        // }

        // YOU CAN SET API KEY HERE
        // headers: {"X-Api-Key": "Some api key"}

        // FOR COOKIE BASED AUTH
        // withCredentials: true,
    })

    const fetchUserHandler = async () => {
        // await axios.get("https://jsonplaceholder.typicode.com/users")
        //     .then(res => console.log(res.request.responseText))

        // THE SECOND WAY TO MAKE A REQUEST
        await axios.request({
            method: 'GET',
            url: 'https://jsonplaceholder.typicode.com/users'
        }).then(res => console.log(res))
    }

    const fetchUserAborted = async () => {
        setTimeout(() => {
            controller.abort("Controller is aborted")
        }, 10);
        await axios.get("https://jsonplaceholder.typicode.com/users", {
            signal: controller.signal
        })
            .then(res => console.log(res))
            .catch(error => {
                if(axios.isCancel(error)) {
                    console.log("Request is cancelled: ", error.message)
                } else if(axios.isAxiosError(error)) {
                    console.log("Axios Error: ", error.message)
                }
            });
    }

    // WORKING WITH FORM IN AXIOS
    const submhitHandler = async (e) => {
        e.preventDefault();

        // const user = {
        //     name: "Joseph",
        //     email: "joseph@gmail.com"
        // }
        // CONVERT THIS TO FROM DATA
        // const form = toFormData(user);

        // CONVERT FORM DATA TO JSON
        // const jsonData = formToJSON(form);

        const formData = new FormData(e.target);
        await axios.post("https://jsonplaceholder.typicode.com/users", formData)
        .then(res => console.log(res))
        .catch(error => {
            console.log(error)
        })
    };

    const perServiceAPIHandler = async () => {
        const { data: users } = await usersApi.get("/users");
        console.log(users)
    }


    // WORKING WITH INTERCEPTOR
    const interceptDataHandler = async () => {
        try {
            const users = await api.get("/users");
            console.log("Users List: ", users)
        } catch(error) {
            console.log("Failed: ", error)
        }
    }

    const tokenCreateHandler = async () => {
        if(localStorage.getItem("token")) return
        localStorage.setItem("token", token);
        console.log("Token added")
    }
    const tokenDeleteHandler = async () => {
        if(localStorage.getItem("token")) {
            localStorage.removeItem("token");
            console.log("Token deleted")
        }
    }



    return (
        <div>
            <h1>Axios API</h1>

            <button onClick={fetchUserHandler}>Fetch User</button>
            <button onClick={fetchUserAborted}>Fetch Aborted</button>

            <h2>Dealing with forms in axios</h2>
            <form onSubmit={submhitHandler}>
                <input type="text" name="name" placeholder='Enter name...' />
                <input type="email" name="email" placeholder='Enter Email...' />
                <button type='submit'>Submit</button>
            </form>

            <h2>Per service API</h2>
            <button onClick={perServiceAPIHandler}>Per Service Hit</button>

            <h2>Create Token</h2>
            <button onClick={tokenCreateHandler}>Create Token</button>
            <button onClick={tokenDeleteHandler}>Delete Token</button>
            <button onClick={interceptDataHandler}>Request with interceptor</button>
        </div>
    )
}

export default AxiosWorking
