<script>
export default {
  methods: {
    async submitForm(login) {
      try {
        const response = await fetch("http://localhost:3000/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ login }),
        });
        if (response.ok) {
          const responseData = await response.json();
        }
        else {
          console.error('error: ', response.status);
        }
      }
      catch (error) {
        console.error('error: sending POST request :', error);
      }
    },
  },
};
</script>

<style scoped>
#userForm {
    text-align:center;
}
</style>