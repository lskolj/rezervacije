<template>
  <q-page class="q-pa-md">
    <h1>Dostupne usluge</h1>
    <p>Odaberite uslugu kako biste vidjeli dostupne termine:</p>

    <q-spinner v-if="ucitavanje" color="primary" size="3em" />
    <q-banner v-if="error" type="negative">{{ error }}</q-banner>

    <div class="row q-gutter-md">
      <q-card
        v-for="usluga in usluge"
        :key="usluga.usluga_id"
        class="my-card"
        bordered
      >
        <q-card-section>
          <div class="text-h6">{{ usluga.naziv }}</div>
          <div class="text-subtitle2">
            {{ usluga.opis }}
          </div>
        </q-card-section>

        <q-card-section>
          <div>Cijena: {{ usluga.cijena }} €</div>
          <div>Trajanje: {{ usluga.trajanje }} min</div>
          <div>
            Dostupnost:
            <strong>{{ usluga.dostupnost ? 'Da' : 'Ne' }}</strong>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn
            label="Vidi termine"
            color="primary"
            flat
            @click="odaberiUslugu(usluga.usluga_id)"
          />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from 'boot/axios'

export default {
  setup() {
    const router = useRouter()
    const usluge = ref([])
    const ucitavanje = ref(false)
    const error = ref('')

    const dohvatiUsluge = async () => {
      ucitavanje.value = true
      error.value = ''
      try {
        const odgovor = await api.get('/usluge')
        usluge.value = odgovor.data
      } catch {
        error.value = 'Greška prilikom dohvaćanja usluga.'
      } finally {
        ucitavanje.value = false
      }
    }

    const odaberiUslugu = (uslugaId) => {
      router.push('/termini/' + uslugaId)
    }

    onMounted(dohvatiUsluge)

    return {
      usluge,
      ucitavanje,
      error,
      odaberiUslugu,
    }
  }
}
</script>

<style scoped>
.my-card {
  width: 100%;
  max-width: 300px;
}
</style>