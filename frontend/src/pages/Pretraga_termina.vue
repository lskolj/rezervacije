<template>
  <q-page class="q-pa-md">
    <h1>Pretraga termina</h1>
    <q-input v-model="search" label="Pretraži po datumu ili usluzi" outlined class="q-mb-md" />

    <q-table
      :rows="termini"
      :columns="columns"
      row-key="termin_id"
      :filter="search"
    />
  </q-page>
</template>

<script>
import { ref } from 'vue'
import { api } from 'boot/axios'

export default {
  setup() {
    const termini = ref([])
    const search = ref('')

    const columns = [
      { name: 'usluga', align: 'left', label: 'Usluga', field: 'usluga', sortable: true },
      { name: 'datum', align: 'left', label: 'Datum', field: 'datum', sortable: true },
      { name: 'vrijeme', align: 'center', label: 'Vrijeme', field: 'vrijeme' },
      { name: 'dostupan', align: 'center', label: 'Dostupno', field: row => row.dostupan ? 'Da' : 'Ne' }
    ]

    const ucitajTermine = async () => {
      try {
        const odgovor = await api.get('/termini')
        termini.value = odgovor.data
      } catch (err) {
        console.error(err)
      }
    }

    ucitajTermine()

    return { termini, search, columns }
  }
}
</script>