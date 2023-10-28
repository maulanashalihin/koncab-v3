<script>
    import Modal from "../../../Components/Modal.svelte";
    import axios from "axios";
    import {
        Toast,
        decrypt,
        encrypt, 
    } from "../../../Components/helper"; 
    import dayjs from "dayjs";
    import relativeTime from "dayjs/plugin/relativeTime";
    dayjs.extend(relativeTime);
    import "dayjs/locale/id";
   import { db } from "../../../Database/schema";

    dayjs.locale("id");

     let admins = [];

    let session_id = localStorage.getItem("session_id");

    let username = "";

    let role = "Asisten Manager";

    let adminModal = false;

    let loginGuideModal = false;

    let current_session_id = "";

    let encrypted_secret_key = "";

    function deleteSession(id) {
        axios.delete("/auth/session/" + id);
        admins = admins.map((admin) => {
            if (admin.Sessions) {
                admin.Sessions = admin.Sessions.filter(
                    (session) => session.ID !== id
                );
            }
            return admin;
        });
    }

    function AddSession(admin_id) {
        axios.post("/auth/session", { admin_id }).then((response) => {
            admins = admins.map((admin) => {
                if (admin.ID === admin_id) {
                    admin.Sessions.push(response.data);
                }
                return admin;
            });
        });
    }

    axios.get("/auth/admin").then((response) => {
        admins = response.data;
    });

    function saveAdmin() {


        axios.post("/auth/admin", { username }).then(async (response) => {
            admins = [...admins, response.data];
            const admin = response.data;
            admin.Role = role;
            await db.admin.put(admin);
            adminModal = false;
        });
    }

    function deleteAdmin(admin) {
        const check = confirm(
            "Yakin ingin menghapus admin " + admin.Username + " ?"
        );
        if (check) {
            axios.delete("/auth/admin/" + admin.ID).then(async () => {
                admins = admins.filter((item) => item.ID !== admin.ID);
                await db.admin.delete(admin.ID);
                
            });
        }
    }

    function ShowGuide(session) {
        let secret_key = decrypt(
            localStorage.getItem("secret_key"),
            location.host
        );
        loginGuideModal = true;
        current_session_id = session.ID;
        encrypted_secret_key = encrypt(secret_key, current_session_id);
    }
</script>

<div>
    <!--
    Heads up! 👋
  
    This component comes with some `rtl` classes. Please remove them if they are not needed in your project.
  -->
    
    <div class="max-w-7xl mx-auto">
        <div class="flex flex-col md:flex-row gap-3 md:justify-between">
            <div class="text-xl md:text-3xl">Daftar Admin</div>
            <button
                on:click={() => {
                    adminModal = true;
                    username = "";
                }}
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >+ Admin</button
            >
        </div>

        <div class="mt-10 space-y-6 overflow-x-auto">
            {#each admins as admin}
                <div class="border p-5">
                  
                    <div
                        class="flex flex-col md:flex-row gap-3 md:justify-between"
                    >
                        <div class="text-xl md:text-2xl font-bold capitalize">
                            {admin.Username}
                          
                        </div>
                       
                        <div class="flex gap-1">
                            <button
                                on:click={() => {
                                    deleteAdmin(admin);
                                }}
                                class="bg-red-500 flex gap-1 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    class="w-6 h-6"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                    />
                                </svg>
                            </button>
                            <button
                                on:click={() => {
                                    AddSession(admin.ID);
                                }}
                                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >+ Session</button
                            >
                        </div>
                    </div>
                    <div class="text-sm font-normal text-gray-500 lowercase">
                        Terakhir login : {admin.LoginAt ? dayjs(admin.LoginAt).fromNow() : 'belum login'}
                    </div>
                    <div class="pt-3 text-sm gap-3 grid md:grid-cols-3">
                        {#each admin.Sessions as session}
                            <div
                                class=" {session_id == session.ID
                                    ? 'border-orange-500 border-2'
                                    : 'border'} text-gray-500 space-y-3 p-3 rounded-lg"
                            >
                                <div class="text-gray-800 flex justify-between">
                                    <div>
                                        {#if session_id == session.ID}<span
                                                class="px-1 py-0.5 text-white bg-orange-500"
                                                >active</span
                                            >{/if}
                                        {session.ID}
                                    </div>
                                    <button
                                        on:click={() => {
                                            deleteSession(session.ID);
                                        }}
                                        class="text-gray-500"
                                        ><svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke-width="1.5"
                                            stroke="currentColor"
                                            class="w-6 h-6"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                            />
                                        </svg>
                                    </button>
                                </div>
                                <div>
                                    {session.UserAgent || "belum login"}
                                </div>
                                <div>
                                    Dibuat pada : {dayjs(
                                        session.CreatedAt
                                    ).fromNow()}
                                </div> 
                                {#if !session.UserAgent}
                                    <div>
                                        <button
                                            on:click={() => {
                                                ShowGuide(session);
                                            }}
                                            class="  flex gap-1 border text-gray-00 font-bold py-2 px-4 rounded"
                                            ><svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke-width="1.5"
                                                stroke="currentColor"
                                                class="w-6 h-6"
                                            >
                                                <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                                                />
                                            </svg>

                                            <div class="flex items-center">
                                                Petunjuk Login
                                            </div></button
                                        >
                                    </div>
                                {:else}
                                    <div
                                        class="bg-blue-100 text-blue-600 px-2 py-1"
                                    >
                                        Session ID hanya bisa digunakan sekali
                                        untuk login
                                    </div>
                                {/if}
                            </div>
                        {/each}
                    </div>
                </div>
            {/each}
        </div>
    </div>
</div>

<Modal width="max-w-lg" bind:show={adminModal} title="Tambah Admin">
    <form on:submit|preventDefault={saveAdmin} class="p-4 space-y-4">
        <div class="space-y-1">
            <label for="name" class="font-medium">Username</label>
            <input
                required
                bind:value={username}
                on:input={() => {
                    username = username.toLowerCase().replace(/[^a-z0-9]/g, "");
                }}
                class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
                type="text"
                id="name"
                placeholder="Masukan Nama"
            />
        </div>
        <div class="space-y-1">
            <label for="role" class="font-medium">Peran</label>
            <select
            required
            bind:value={role}
            class="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 placeholder-gray-400"
            id="modul"
         >
            {#each ["Manager","Asisten Manager","Supervisor"] as item}
               <option value={item}>{item}</option>
            {/each}
         </select>
        </div>

        <button
            type="submit"
            class="inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none w-full px-4 py-3 leading-6 rounded border-yellow-500 bg-yellow-500 text-white hover:text-white hover:bg-yellow-800 hover:border-yellow-800 focus:ring focus:ring-yellow-500 focus:ring-opacity-50 active:bg-yellow-700 active:border-yellow-700"
        >
            Simpan
        </button>
    </form>
</Modal>

<Modal width="max-w-lg" bind:show={loginGuideModal} title="Petunjuk Login">
    <div class="p-4 space-y-4 overflow-auto">
        <p>1. Buka Halaman Login di</p>
        <div>
            <input
                class="outline-none w-full border px-3 py-2"
                type="text"
                value="{location.host}/login"
            />
            <div>
                <button
                    on:click={() => {
                        navigator.clipboard.writeText(`${location.host}/login`);
                        Toast("Login URL telah disalin");
                    }}
                    class="text-xs text-gray-500">salin login url</button
                >
            </div>
        </div>
        <p>2. Gunakan Session ID ini</p>
        <div>
            <input
                class="outline-none w-full border px-3 py-2"
                type="text"
                value={current_session_id}
            />
            <div>
                <button
                    on:click={() => {
                        navigator.clipboard.writeText(current_session_id);
                        Toast("Session ID telah disalin");
                    }}
                    class="text-xs text-gray-500">salin session id</button
                >
            </div>
        </div>
        <p>3. Gunakan Secret Key ini</p>
        <div>
            <textarea
                value={encrypted_secret_key}
                readonly
                class="outline-none w-full border px-3 py-2"
                name=""
                id=""
                rows="2"
            />
            <div>
                <button
                    on:click={() => {
                        navigator.clipboard.writeText(encrypted_secret_key);
                        Toast("Secret Key telah disalin");
                    }}
                    class="text-xs text-gray-500">salin secret key</button
                >
            </div>
        </div>
        <button
            on:click={() => {
                navigator.clipboard.writeText(
                    `1. Buka Halaman Login di ${location.host}/login \n2. Gunakan Session ID ini ${current_session_id}\n3. Gunakan Secret Key ini ${encrypted_secret_key}`
                );
                Toast("Petunjuk Login telah disalin");
            }}
            class="border px-2 py-1 text-gray-400">Salin Petunjuk</button
        >
    </div>
</Modal>
