<template>
  <q-page class="q-pa-md">
    <h1>Pretraga usluga</h1>
    <q-input v-model="search" label="Pretraži po nazivu" outlined class="q-mb-md" />

    <q-table
      :rows="usluge"
      :columns="columns"
      row-key="usluga_id"
      :filter="search"
    />
  </q-page>
</template>

<script>
import { ref } from 'vue'
import { api } from 'boot/axios'

export default {
  setup() {
    const usluge = ref([])
    const search = ref('')

    const columns = [
      { name: 'naziv', align: 'left', label: 'Naziv', field: 'naziv', sortable: true },
      { name: 'opis', align: 'left', label: 'Opis', field: 'opis' },
      { name: 'cijena', align: 'center', label: 'Cijena (€)', field: 'cijena' },
      { name: 'trajanje', align: 'center', label: 'Trajanje (min)', field: 'trajanje' }
    ]

    const ucitajUsluge = async () => {
      try {
        const odgovor = await api.get('/usluge')
        usluge.value = odgovor.data
      } catch (err) {
        console.error(err)
      }
    }

    ucitajUsluge()

    return { usluge, search, columns }
  }
}
</script>