<script> 
    import { db } from "../../Database/schema";

    const params = new URLSearchParams(location.search);

    // To get the value of a specific parameter, use the get() method
    const reason = params.get("reason") || "Unknown Error";

    db.delete().then(() => {
        console.log("database deleted");
    });



</script>

<div class="h-screen flex justify-center items-center">
    <h1>{reason}</h1>
</div>
