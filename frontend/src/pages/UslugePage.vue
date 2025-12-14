<template>
  <q-page class="q-pa-md">
    <h1>Dostupne usluge</h1>
    <p>Odaberite uslugu kako biste vidjeli dostupne termine:</p>

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
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const router = useRouter()
    const usluge = ref([
      { usluga_id: 1, naziv: 'Frizerski salon', opis: 'Šišanje i oblikovanje kose', trajanje: 90, cijena: 45, dostupnost: true },
      { usluga_id: 2, naziv: 'Automehaničar', opis: 'Servis i dijagnostika vozila', trajanje: 60, cijena: 100, dostupnost: true },
      { usluga_id: 3, naziv: 'Popravak računala', opis: 'Dijagnostika i popravak hardvera i softvera', trajanje: 120, cijena: 80, dostupnost: false },
      { usluga_id: 4, naziv: 'Stomatolog', opis: 'Osnovni stomatološki pregled', trajanje: 30, cijena: 50, dostupnost: true },
      { usluga_id: 5, naziv: 'Manikura', opis: 'Uređivanje i lakiranje noktiju', trajanje: 45, cijena: 30, dostupnost: false }
    ])

    const odaberiUslugu = (uslugaId) => {
      console.log('Odabrana usluga ID:', uslugaId)
      router.push('/termini/' + uslugaId) // vodi na TerminiPage filtrirano po usluzi
    }

    return {
      usluge,
      odaberiUslugu
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
