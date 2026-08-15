<template>
  <q-page class="q-pa-md">
    <h1>Termini</h1>
    <p>Prikaz dostupnih termina:</p>

    <q-banner v-if="error" type="negative">{{ error }}</q-banner>

    <q-table
      title="Dostupni termini"
      :rows="termini"
      :columns="columns"
      row-key="termin_id"
      :loading="ucitavanje"
    >
      <template v-slot:body-cell-actions="props">
        <q-td align="center">
          <q-btn
            flat
            color="primary"
            label="Rezerviraj"
            :disable="!props.row.dostupan"
            @click="rezervirajTermin(props.row)"
          />
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { api } from 'boot/axios'

export default {
  setup() {
    const route = useRoute()
    const termini = ref([])
    const ucitavanje = ref(false)
    const error = ref('')

    const uslugaId = route.params.uslugaId ? Number(route.params.uslugaId) : null

    const dohvatiTermine = async () => {
      ucitavanje.value = true
      error.value = ''
      try {
        const parametri = uslugaId ? { uslugaId } : {}
        const odgovor = await api.get('/termini', { params: parametri })
        termini.value = odgovor.data
      } catch {
        error.value = 'Greška prilikom dohvaćanja termina.'
      } finally {
        ucitavanje.value = false
      }
    }

    const columns = [
      { name: 'usluga', label: 'Usluga', field: 'usluga', align: 'left' },
      { name: 'datum', label: 'Datum', field: 'datum', align: 'left' },
      { name: 'vrijeme', label: 'Vrijeme', field: 'vrijeme', align: 'center' },
      { name: 'dostupan', label: 'Dostupnost', field: row => row.dostupan ? 'Da' : 'Ne', align: 'center' },
      { name: 'actions', label: 'Akcije', field: 'actions', align: 'center' }
    ]

    const rezervirajTermin = async (termin) => {
      if (!termin.dostupan) {
        alert(`Termin za "${termin.usluga}" nije dostupan i ne može se rezervirati!`)
        return
      }

      if (!localStorage.getItem('token')) {
        alert('Morate biti prijavljeni da biste rezervirali termin.')
        return
      }

      try {
        await api.post('/rezervacije', { termin_id: termin.termin_id })
        alert(`Termin za "${termin.usluga}" je rezerviran!`)
        await dohvatiTermine()
      } catch (err) {
        alert(err.response?.data?.error || 'Greška prilikom rezervacije.')
      }
    }

    onMounted(dohvatiTermine)

    return { termini, columns, rezervirajTermin, ucitavanje, error }
  }
}
</script>