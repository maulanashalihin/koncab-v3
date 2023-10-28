<script>
  import "../app.css";
  import axios from "axios";

  import { dev } from "$app/environment"; 
    import { goto } from "$app/navigation";

  const url = dev ? "http://localhost:3000" : "https://portal.koncab.my.id:3000";

  axios.interceptors.request.use(
    (config) => {
      config.baseURL = url;

      if(localStorage.getItem("session_id")) {
        config.headers["Authorization"] = `Bearer ${localStorage.getItem("session_id")}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response.status == 401) {
        localStorage.removeItem("session_id");
        localStorage.removeItem("secret_key");
        
        goto("/error?reason=401 Unauthorized")

      }
      return Promise.reject(error);
    }
  );

 
</script>

<slot />
