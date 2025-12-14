<template>
  <q-page class="container">
    <h1>Registracija</h1>
    <p>Unesite svoje podatke:</p>

    <q-input v-model="username" label="Korisničko ime" outlined />
    <q-input v-model="email" label="Email" outlined type="email"/>
    <q-input v-model="password" label="Lozinka" outlined type="password" />
    <q-btn label="Potvrdi" @click="register" color="primary" />
  </q-page>
</template>

<script>
  import { route } from 'quasar/wrappers';
import { ref } from 'vue';
  import { useRouter } from 'vue-router';
export default {
  setup() {
    const username = ref('');
    const email = ref('');
    const password = ref('');

    const register = () => {
      console.log('Registracija', username.value, email.value, password.value);
      router.push('usluge');
    };


    return {
      username,
      email,
      password,
      register
    };

  }
}
</script>
