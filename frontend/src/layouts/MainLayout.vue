<template>
  <q-layout view="lHh Lpr lFf">

    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Sustav za rezervacije
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>

        <q-item clickable to="/login">
          <q-item-section avatar>
            <q-icon name="login" />
          </q-item-section>
          <q-item-section>
            Login
          </q-item-section>
        </q-item>

        <q-item clickable to="/registracija">
          <q-item-section avatar>
            <q-icon name="person_add" />
          </q-item-section>
          <q-item-section>
            Registracija
          </q-item-section>
        </q-item>

        <q-item clickable to="/usluge">
          <q-item-section avatar>
            <q-icon name="build" />
          </q-item-section>
          <q-item-section>
            Usluge
          </q-item-section>
        </q-item>

        <q-item clickable to="/termini"> <!--vodi na TerminiPage sa uslugaID = 1 -->
      <q-item-section avatar>
        <q-icon name="event" />
      </q-item-section>
      <q-item-section>
        Termini
      </q-item-section>
    </q-item>

    <q-item clickabke to="/moje_rezervacije">
      <q-item-section avatar>
        <q-icon name="book_online" />
      </q-item-section>
      <q-item-section>
        Moje rezervacije
      </q-item-section>
    </q-item>

      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup>
import { ref } from 'vue'

const leftDrawerOpen = ref(false)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
