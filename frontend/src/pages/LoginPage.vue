<template>
  <q-page class="container">
    <h1>Prijava</h1>
    <p>Unesite korisničko ime i lozinku za prijavu.</p>

    <q-input v-model="username" label="Korisničko ime" outlined />
    <q-input v-model="password" label="Lozinka" outlined type="password" />
    <q-btn label="Potvrdi" @click="login" color="primary" :loading="ucitavanje" />

    <q-banner class="q-mt-md" v-if="error" type="negative">{{ error }}</q-banner>
  </q-page>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { api } from 'boot/axios';

export default {
  setup() {
    const username = ref('');
    const password = ref('');
    const error = ref('');
    const ucitavanje = ref(false);
    const router = useRouter();

    const login = async () => {
      if (!username.value || !password.value) {
        error.value = 'Molimo unesite korisničko ime i lozinku.';
        return;
      }

      error.value = '';
      ucitavanje.value = true;

      try {
        const odgovor = await api.post('/login', {
          username: username.value,
          password: password.value,
        });

        localStorage.setItem('token', odgovor.data.token);
        localStorage.setItem('korisnik', JSON.stringify(odgovor.data.korisnik));

        if (odgovor.data.korisnik.uloga === 'administrator') {
          router.push('/admin');
        } else {
          router.push('/usluge');
        }
      } catch (err) {
        error.value = err.response?.data?.error || 'Greška prilikom prijave.';
      } finally {
        ucitavanje.value = false;
      }
    };

    return {
      username,
      password,
      error,
      ucitavanje,
      login,
    };
  },
};
</script>