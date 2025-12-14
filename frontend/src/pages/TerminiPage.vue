<template>
  <q-page class="q-pa-md">
    <h1>Termini</h1>
    <p>Prikaz dostupnih termina:</p>

    <q-table
      title="Dostupni termini"
      :rows="prikazTermina"
      :columns="columns"
      row-key="termin_id"
    >
      <!-- "Rezerviraj" -->
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
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

export default {
  setup() {
    const route = useRoute()
    const sviTermini = ref([
      { termin_id: 1, usluga_id: 1, usluga: 'Frizerski salon', datum: '01/07/2025', vrijeme: '10:00', dostupan: true },
      { termin_id: 2, usluga_id: 1, usluga: 'Frizerski salon', datum: '03/07/2025', vrijeme: '11:45', dostupan: false },
      { termin_id: 3, usluga_id: 2, usluga: 'Automehaničar', datum: '15/04/2025', vrijeme: '12:15', dostupan: true },
      { termin_id: 4, usluga_id: 2, usluga: 'Automehaničar', datum: '23/04/2025', vrijeme: '13:00', dostupan: true },
      { termin_id: 5, usluga_id: 3, usluga: 'Masaža', datum: '08/07/2025', vrijeme: '14:30', dostupan: false },
      { termin_id: 6, usluga_id: 3, usluga: 'Masaža', datum: '19/07/2025', vrijeme: '15:00', dostupan: true },
      { termin_id: 7, usluga_id: 4, usluga: 'Spa', datum: '14/02/2025', vrijeme: '10:00', dostupan: true },
      { termin_id: 8, usluga_id: 4, usluga: 'Spa', datum: '28/02/2025', vrijeme: '11:30', dostupan: false },
      { termin_id: 9, usluga_id: 5, usluga: 'Pedikura', datum: '05/05/2025', vrijeme: '12:00', dostupan: true },
      { termin_id: 10, usluga_id: 5, usluga: 'Pedikura', datum: '20/05/2025', vrijeme: '13:15', dostupan: true }
    ])

    const uslugaId = route.params.uslugaId ? Number(route.params.uslugaId) : null
    //ako postoji uslugaId filtriraj, inače prikazi sve
    const prikazTermina = computed(() => {
      return uslugaId ? sviTermini.value.filter(t => t.usluga_id === uslugaId) : sviTermini.value
    })

    const columns = [
      { name: 'usluga', label: 'Usluga', field: 'usluga', align: 'left' },
      { name: 'datum', label: 'Datum', field: 'datum', align: 'left' },
      { name: 'vrijeme', label: 'Vrijeme', field: 'vrijeme', align: 'center' },
      { name: 'dostupan', label: 'Dostupnost', field: row => row.dostupan ? 'Da' : 'Ne', align: 'center' },
      { name: 'actions', label: 'Akcije', field: 'actions', align: 'center' } // za slot
    ]

    // Funkcija za rezervaciju
    const rezervirajTermin = (termin) => {
      // provjera dostupnosti
      if (!termin.dostupan) {
        alert(`Termin za "${termin.usluga}" nije dostupan i ne može se rezervirati!`)
        return
      }

      let sveRezervacije = JSON.parse(localStorage.getItem('rezervacije') || '[]')
      sveRezervacije.push({
        id: termin.termin_id,
        usluga: termin.usluga,
        datum: termin.datum,
        vrijeme: termin.vrijeme,
        status: 'aktivna'
      })
      localStorage.setItem('rezervacije', JSON.stringify(sveRezervacije))
      alert(`Termin za "${termin.usluga}" je rezerviran!`)
    }

    return { prikazTermina, columns, rezervirajTermin }
  }
}
</script>
