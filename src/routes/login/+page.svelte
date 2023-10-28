<script>
   import axios from "axios";
   import { Toast, encrypt, decrypt } from "../../Components/helper";
   import { goto } from "$app/navigation";

   // Decrypt
   let session_id = "";
   let secret_key = "";
   let error = "";

   if (localStorage.getItem("session_id")) {
      goto("/home");
   }

   function login() {
      let decrypted_secret_key = decrypt(secret_key, session_id);

      axios.get("/first-logs").then((response) => {
         const decrypted_data = decrypt(
            response.data.Data,
            decrypted_secret_key
         );

         if (decrypted_data == '"first data"') {
            axios.post("/login", { session_id }).then(
               (response) => {
                  const encrypted_secret_key = encrypt(
                     decrypted_secret_key,
                     location.host
                  );

                  localStorage.setItem("website",JSON.stringify(response.data));

                  localStorage.setItem("secret_key", encrypted_secret_key);

                  localStorage.setItem("session_id", session_id);

                  goto("/home");
               },
               (error) => {
                  Toast(error.response.data.error, "error");
               }
            );
         } else {
            Toast("Session ID atau Secret Key Salah", "error");
         }
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
                  Login to your account
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
                  on:submit|preventDefault={login}
               >
                  <div>
                     <label
                        for="session_id"
                        class="block mb-2 text-sm font-medium text-gray-900"
                        >Session ID</label
                     >
                     <input
                        bind:value={session_id}
                        required
                        type="text"
                        name="session_id"
                        id="session_id"
                        class="bg-gray-50 border outline-none border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5"
                        placeholder="f7e58d3a-7ad6-4564-b02b-697eef91922c"
                     />
                  </div>
                  <div>
                     <label
                        for="password"
                        class="block mb-2 text-sm font-medium text-gray-900"
                        >Secret Key</label
                     >
                     <input
                        bind:value={secret_key}
                        required
                        type="password"
                        name="password"
                        id="password"
                        placeholder="••••••••"
                        class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5"
                     />
                  </div>
                  <button
                     type="submit"
                     class="w-full text-white bg-orange-500 hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-orange-500 dark:hover:bg-orange-700 dark:focus:ring-orange-800"
                     >Login</button
                  >
               </form>
            </div>
         </div>
      </div>
   </section>
</div>
