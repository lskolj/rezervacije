<template>
  <q-page class="container">
    <h1>Prijava</h1>
    <p>Unesite korisničko ime i lozinku za prijavu.</p>

    <q-input v-model="username" label="Korisničko ime" outlined />
    <q-input v-model="password" label="Lozinka" outlined type="password" />
    <q-btn label="Potvrdi" @click="login" color="primary" />

 <q-banner class="q-mt-md" v-if="error" type="negative">{{ error }}</q-banner>
 </q-page>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const username=ref('');
    const password=ref('');
    const error=ref('');
    const router=useRouter();

    const login = async () => {
      if(!username.value || !password.value){
        error.value='Molimo unesite korisničko ime i lozinku.';
        return;
      }
      if(username.value=== 'admin') {
        router.push('admin')
      } else {
        router.push('usluge')
      }

      console.log('Prijava', username.value, password.value);
    }

    return {
      username,
      password,
      login
    }

  }
}
</script>
