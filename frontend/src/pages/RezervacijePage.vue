<template>
  <q-page class="q-pa-md">
    <h1>Moje rezervacije</h1>
    <p>Pregled svih vaših rezervacija:</p>

    <q-list bordered padding>
      <q-item
        v-for="rezervacija in rezervacije"
        :key="rezervacija.id"
        clickable
        v-ripple
      >
        <q-item-section>
          <div class="text-h6">{{ rezervacija.usluga }}</div>
          <div class="text-subtitle2">
            Datum: {{ rezervacija.datum }} | Vrijeme: {{ rezervacija.vrijeme }}
          </div>
          <div>Status: <strong>{{ rezervacija.status }}</strong></div>
        </q-item-section>

        <q-item-section thumbnail>

        </q-item-section>

        <q-item-section side top>
          <q-btn
            flat
            color="negative"
            size="sm"
            label="Otkazi"
            @click.stop="otkaziRezervaciju(rezervacija.id)"
          />
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    //primjer rezervacija
    const rezervacije = ref([
      { id: 1, usluga: 'Frizerski salon', datum: '15/12/2025', vrijeme: '09:00', status: 'aktivna' },
      { id: 2, usluga: 'Automehaničar', datum: '16/12/2025', vrijeme: '14:00', status: 'aktivna' },
      { id: 3, usluga: 'Masaža', datum: '17/12/2025', vrijeme: '12:00', status: 'otkazana' }
    ])

    const otkaziRezervaciju = (id) => {
      const index = rezervacije.value.findIndex(r => r.id === id)
      if (index !== -1) {
        rezervacije.value[index].status = 'otkazana'
        alert(`Rezervacija "${rezervacije.value[index].usluga}" je otkazana!`)
      }
    }

    return {
      rezervacije,
      otkaziRezervaciju
    }
  }
}
</script>

<style scoped>
/* slika ne smije biti prevelika */
q-item-section[thumbnail] img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
}
</style>
