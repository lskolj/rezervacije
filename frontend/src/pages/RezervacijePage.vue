<template>
  <q-page class="q-pa-md">
    <h1>Moje rezervacije</h1>
    <p>Pregled svih vaših rezervacija:</p>

    <q-banner v-if="error" type="negative">{{ error }}</q-banner>
    <q-spinner v-if="ucitavanje" color="primary" size="3em" />

    <q-list bordered padding>
      <q-item
        v-for="rezervacija in rezervacije"
        :key="rezervacija.rezervacija_id"
        clickable
        v-ripple
      >
        <q-item-section>
          <div class="text-h6">{{ rezervacija.naziv }}</div>
          <div class="text-subtitle2">
            Datum: {{ rezervacija.datum }} | Vrijeme: {{ rezervacija.vrijeme }}
          </div>
          <div>Status: <strong>{{ rezervacija.status }}</strong></div>
        </q-item-section>

        <q-item-section side top>
          <q-btn
            v-if="rezervacija.status === 'aktivna'"
            flat
            color="negative"
            size="sm"
            label="Otkaži"
            @click.stop="otkaziRezervaciju(rezervacija.rezervacija_id)"
          />
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue'
import { api } from 'boot/axios'

export default {
  setup() {
    const rezervacije = ref([])
    const ucitavanje = ref(false)
    const error = ref('')

    const dohvatiRezervacije = async () => {
      ucitavanje.value = true
      error.value = ''
      try {
        const odgovor = await api.get('/rezervacije')
        rezervacije.value = odgovor.data
      } catch {
        error.value = 'Greška prilikom dohvaćanja rezervacija. Jeste li prijavljeni?'
      } finally {
        ucitavanje.value = false
      }
    }

    const otkaziRezervaciju = async (id) => {
      try {
        await api.put(`/rezervacije/${id}/otkazi`)
        await dohvatiRezervacije()
        alert('Rezervacija je otkazana!')
      } catch (err) {
        alert(err.response?.data?.error || 'Greška prilikom otkazivanja.')
      }
    }

    onMounted(dohvatiRezervacije)

    return {
      rezervacije,
      ucitavanje,
      error,
      otkaziRezervaciju
    }
  }
}
</script>