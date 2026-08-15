<template>
  <q-page class="container">
    <h1>Registracija</h1>
    <p>Unesite svoje podatke:</p>

    <q-input v-model="username" label="Korisničko ime" outlined />
    <q-input v-model="email" label="Email" outlined type="email" />
    <q-input v-model="password" label="Lozinka" outlined type="password" />
    <q-btn label="Potvrdi" @click="register" color="primary" :loading="ucitavanje" />

    <q-banner class="q-mt-md" v-if="error" type="negative">{{ error }}</q-banner>
    <q-banner class="q-mt-md" v-if="uspjeh" type="positive">{{ uspjeh }}</q-banner>
  </q-page>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { api } from 'boot/axios';

export default {
  setup() {
    const username = ref('');
    const email = ref('');
    const password = ref('');
    const error = ref('');
    const uspjeh = ref('');
    const ucitavanje = ref(false);
    const router = useRouter();

    const register = async () => {
      if (!username.value || !email.value || !password.value) {
        error.value = 'Sva polja su obavezna.';
        return;
      }

      error.value = '';
      uspjeh.value = '';
      ucitavanje.value = true;

      try {
        await api.post('/register', {
          username: username.value,
          email: email.value,
          password: password.value,
        });

        uspjeh.value = 'Registracija uspješna! Preusmjeravam na prijavu...';
        setTimeout(() => router.push('/login'), 1000);
      } catch (err) {
        error.value = err.response?.data?.error || 'Greška prilikom registracije.';
      } finally {
        ucitavanje.value = false;
      }
    };

    return {
      username,
      email,
      password,
      error,
      uspjeh,
      ucitavanje,
      register,
    };
  },
};
</script>