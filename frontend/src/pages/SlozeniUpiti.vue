<template>
  <q-page class="q-pa-md">
    <h1>Složeni upiti</h1>

    <q-card class="q-mb-md" bordered flat>
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">Rezervacije po usluzi</div>
      </q-card-section>
      <q-table
        :rows="rezervacijePoUsluzi"
        :columns="stupciUsluge"
        row-key="naziv"
        flat
        hide-bottom
      />
    </q-card>

    <q-card class="q-mb-md" bordered flat>
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">Najaktivniji korisnici</div>
      </q-card-section>
      <q-table
        :rows="najaktivniji"
        :columns="stupciKorisnici"
        row-key="username"
        flat
        hide-bottom
      />
    </q-card>

    <q-card bordered flat>
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">Dostupni termini (nadolazeći)</div>
      </q-card-section>
      <q-table
        :rows="dostupniTermini"
        :columns="stupciTermini"
        row-key="termin_id"
        flat
      />
    </q-card>
  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue'
import { api } from 'boot/axios'

export default {
  setup() {
    const rezervacijePoUsluzi = ref([])
    const najaktivniji = ref([])
    const dostupniTermini = ref([])

    const stupciUsluge = [
      { name: 'naziv', label: 'Usluga', field: 'naziv', align: 'left' },
      { name: 'broj_rezervacija', label: 'Broj aktivnih rezervacija', field: 'broj_rezervacija', align: 'center' }
    ]
    const stupciKorisnici = [
  { name: 'username', label: 'Korisnik', field: 'username', align: 'left' },
  { name: 'broj_aktivnih', label: 'Broj aktivnih rezervacija', field: 'broj_aktivnih', align: 'center' }
]
    const stupciTermini = [
      { name: 'naziv', label: 'Usluga', field: 'naziv', align: 'left' },
      { name: 'datum', label: 'Datum', field: 'datum', align: 'left' },
      { name: 'vrijeme', label: 'Vrijeme', field: 'vrijeme', align: 'center' }
    ]

    const ucitajStatistiku = async () => {
      try {
        const [a, b, c] = await Promise.all([
          api.get('/statistika/rezervacije-po-usluzi'),
          api.get('/statistika/najaktivniji-korisnici'),
          api.get('/statistika/dostupni-termini')
        ])
        rezervacijePoUsluzi.value = a.data
        najaktivniji.value = b.data
        dostupniTermini.value = c.data
      } catch (err) {
        console.error(err)
      }
    }

    onMounted(ucitajStatistiku)

    return { rezervacijePoUsluzi, najaktivniji, dostupniTermini, stupciUsluge, stupciKorisnici, stupciTermini }
  }
}
</script>