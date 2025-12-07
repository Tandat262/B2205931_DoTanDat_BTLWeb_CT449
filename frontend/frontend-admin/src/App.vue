<template>
  <router-view />
</template>

<script setup>
</script>

<style>
:root {
  --primary: #795548;       
  --primary-dark: #5D4037;  
  --bg: #FFF3E0;           
  --text: #3E2723;          
  --card-shadow: 0 10px 30px rgba(121, 85, 72, 0.2);
}


body {
  margin: 0;

  font-family: "Segoe UI", Arial, sans-serif;
}
.btn-primary {
  background: linear-gradient(45deg, var(--primary), #A1887F) !important;
  border: none !important;
  border-radius: 10px;
}

.modal-header.bg-primary {
  background: var(--primary) !important;
}
</style>
