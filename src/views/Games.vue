<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import Modal from '../components/Modal.vue';

import { validateEmptyFields } from "../composables/validation"
import type { Game } from "../interfaces/Game"

interface State {
  games: {
    id: number;
    title: string;
    genre: string;
    played: boolean;
  }[];
  game: Game;
  modal: boolean;
  mode: boolean;
  error: boolean;
}

const state: State = reactive({
  games: [],
  game: {
    id: Date.now(),
    title: "",
    genre: "",
    played: false,
  },
  modal: false,
  mode: true,
  error: false,
})

onMounted(async () => {
  await getGames()
})


function getGames() {
  const storageGames = localStorage.getItem("Games")
  const games = JSON.parse(String(storageGames))
  state.games = games
}


function getGame(pk: number) {
  state.games.filter(game => {
    if (game.id == pk)
      state.game = game
  })
}


function createGame() {
  const isValid = validateEmptyFields(state.game)
  if (!isValid) return state.error = true

  const storageGames = localStorage.getItem("Games")
  state.games = JSON.parse(String(storageGames));
  if (!state.games) state.games = [];

  state.games.push(state.game)
  localStorage.setItem("Games", JSON.stringify(state.games))

  resetForm()
  state.error = false
}


function updateGame() {
  const isValid = validateEmptyFields(state.game)
  if (!isValid) return state.error = true

  const storageGames = localStorage.getItem("Games")
  state.games = JSON.parse(String(storageGames))

  state.games.filter(game => {
    if (game.id == state.game.id) {
      const index = state.games.indexOf(game)
      state.games[index] = state.game

      localStorage.setItem("Games", JSON.stringify(state.games))
    }
  })

  resetForm()
  state.error = false
}


function deleteGame(pk: number) {
  state.games.filter(game => {
    if (game.id == pk) {
      const index = state.games.indexOf(game)
      state.games.splice(index, 1)

      localStorage.setItem("Games", JSON.stringify(state.games))
    }
  })
}


function resetForm() {
  state.game = {
    id: Date.now(),
    title: "",
    genre: "",
    played: false,
  }
}
</script>

<template>
  <div class="jumbotron vertical-center">
    <div class="container">
      <div class="row">
        <div class="col-sm-12">
          <h1 class="text-center bg-primary text-white p-1 rounded-3">
            Games Library 🕹️
          </h1>
          <hr />
          <br />

          <div class="d-flex justify-content-between">
            <button @click="[state.mode = true, resetForm()]" type="button" class="btn btn-success btn-sm"
              data-bs-toggle="modal" data-bs-target="#exampleModal">
              {{ state.games?.length == 0 ? 'Novo Jogo' : 'Novo Jogo+' }}
            </button>

            <Transition name="list" v-if="state.error" tag="div">
              Preencha os campos Titulo e Genêro para registrar um jogo
            </Transition>
          </div>


          <br />
          <br />

          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr class="text-center">
                  <th scope="col">Titulo</th>
                  <th scope="col">Genêro</th>
                  <th scope="col">Jogou?</th>
                  <th scope="col">Ações</th>
                </tr>
              </thead>

              <TransitionGroup name="list" tag="tbody" class="table table-hover">
                <tr v-for="game, key in state.games" :key="key" class="text-center">
                  <td>{{ game.title }}</td>
                  <td>{{ game.genre }}</td>
                  <td>{{ game.played ? 'Sim' : 'Não' }}</td>
                  <td>
                    <div class="btn-group" role="group">
                      <button class="btn btn-info btn-sm action" data-bs-toggle="modal" data-bs-target="#exampleModal"
                        @click="[state.modal = true, state.mode = false, getGame(game.id)]">
                        Atualizar
                      </button>

                      <button class="btn btn-danger btn-sm action" @click="deleteGame(game.id)">
                        Deletar
                      </button>
                    </div>
                  </td>
                </tr>
              </TransitionGroup>
            </table>
          </div>

          <footer class="bg-primary text-white text-center p-1 rounded-3">
            Copyright &copy;. All rights reserved 2022.
          </footer>
        </div>
      </div>

      <Modal :open="state.modal" :mode="state.mode" @newGame="state.games = $event">
        <template #header>
          {{ state.mode ? 'Adicione um jogo novo' : 'Atualize o jogo' }}
        </template>

        <template #body>
          <label class="form-label">Título:</label>
          <input class="form-control" type="text" placeholder="Nome do Game" v-model="state.game.title" />

          <label class="form-label mt-3">Genêro:</label>
          <input class="form-control" type="text" placeholder="Genêro do Game" v-model="state.game.genre" />

          <label class="form-label mt-3">Jogou?</label>
          <input class="ms-5" type="checkbox" v-model="state.game.played" id="flexCheckDefault" />
        </template>

        <template #footer>
          <button type="button" class="btn btn-outline-info" data-bs-dismiss="modal"
            @click="state.mode ? createGame() : updateGame()">
            {{ state.mode ? 'Criar' : 'Atualizar' }}
          </button>

          <button type="reset" class="btn btn-outline-danger" @click="resetForm">
            Limpar
          </button>
        </template>
      </Modal>
    </div>
  </div>
</template>
  
<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.table-responsive::-webkit-scrollbar {
  display: none;
}

@media (min-width: 380px) and (max-width: 480px) {

  html,
  body {
    font-size: 90%;
  }

  tr {
    font-size: small;
    min-width: 380px;
  }

  button {
    font-size: smaller;
  }

  .table-responsive {
    overflow-x: auto;
  }
}

@media (min-width: 315px) and (max-width: 379px) {

  html,
  body {
    font-size: 80%;
  }

  tr,
  thead {
    font-size: xx-small;
  }

  button {
    font-size: xx-small;
  }
}
</style>
  