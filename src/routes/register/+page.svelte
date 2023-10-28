<script>
    import axios from "axios";
    import {
        Toast,
        encrypt,
        decrypt,
        generateRandomString,
    } from "../../Components/helper"; 
    import { Log } from "../../Database/schema";
    import { goto } from "$app/navigation";

    // Decrypt
    let username = "";
    let error = "";

    if (localStorage.getItem("session_id")) {

        goto("/home");
        
    } else {
        axios.get("/allow-register").then(
            (response) => {
               localStorage.setItem("website",JSON.stringify(response.data));
            },
            (error) => {  
                  goto("/login");
            }
        );
    }

    function register() {
        axios.post("/register", { username }).then((response) => {
            localStorage.setItem("session_id", response.data);

            const decrypted_secret_key = generateRandomString(32);

            const encrypted_secret_key = encrypt(
                decrypted_secret_key,
                location.host
            );

            localStorage.setItem("secret_key", encrypted_secret_key);

            Log("logs", "first data");

            goto("/home");
        });
    }
</script>

<div>
    <section class="bg-gray-50">
        <div
            class="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0"
        >
            <div
                class="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 -gray-700"
            >
                <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1
                        class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl"
                    >
                        Create Account
                    </h1>
                    {#if error}
                        <div
                            class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:text-red-400"
                            role="alert"
                        >
                            {error}
                        </div>
                    {/if}

                    <form
                        class="space-y-4 md:space-y-6"
                        on:submit|preventDefault={register}
                    >
                        <div>
                            <label
                                for="username"
                                class="block mb-2 text-sm font-medium text-gray-900"
                                >Username</label
                            >
                            <input
                                bind:value={username}
                                required
                                type="text"
                                name="username"
                                id="username"
                                class="bg-gray-50 border outline-none border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5"
                                placeholder="Abdullah"
                            />
                        </div>

                        <button
                            type="submit"
                            class="w-full text-white bg-orange-500 hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-orange-500 dark:hover:bg-orange-700 dark:focus:ring-orange-800"
                            >Register</button
                        >
                    </form>
                </div>
            </div>
        </div>
    </section>
</div>
