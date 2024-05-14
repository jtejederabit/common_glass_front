<script setup lang="ts">
import { ref, computed } from 'vue';
import {arrowUp, arrowDown} from "../../assets/icons/icons.ts";
import Search from "./components/Search.vue";
import Pagination from "./components/pagination.vue";

// Definició de les propietats del component
// items: Array d'objectes que es mostraran a la taula
// columns: Array d'objectes amb la definició de les columnes de la taula
//      Exemple: [
//          {key: 'givenName', label: 'Nom', sortable: true},
//      ]
// searchProps: Array amb els noms de les propietats dels objectes que es poden cercar
//      Exemple: ['givenName', 'familyName']
// search: Indica si es mostra el camp per cercar. Per defecte: false
// pagination: Indica si es mostra la paginació. Per defecte: false

const props = withDefaults(
    defineProps<{
      items: any[];
      columns: Record<string, any>[];
      searchProps?: string[];
      search?: boolean;
      pagination?: boolean;
    }>(),
    {
      pagination: false,
      search: false
    }
);

const search = ref<string>('');
const sortColumn = ref<string>('');
const sortDirection = ref<'asc' | 'desc'>('asc');
const page = ref(1);
const pageSize = ref(5);

// Filtra els items segons el search value i els ordena segons la columna seleccionada
// Només es pot cercar en les propietats indicades a searchProps i els valors han de ser string o number
// Si la columna és sortable, es canvia la direcció de l'ordenació
const filterAndSortItems = computed(() => {
  let items = props.items;

  if (search.value && props.searchProps) {
    items = items.filter(item => {
      return props.searchProps?.some(prop => {
        if (!item[prop]) {
          return false;
        } else if (typeof item[prop] === 'number') {
          return item[prop].toString().includes(search.value);
        } else if (typeof item[prop] === 'string') {
          return item[prop].toLowerCase().includes(search.value.toLowerCase());
        }
        return false;
      });
    });
  }

  if (sortColumn.value) {
    items.sort((curr, next) => {
      const currValue = curr[sortColumn.value];
      const nextValue = next[sortColumn.value];

      if (currValue === nextValue) return 0;

      const comparison = currValue > nextValue ? 1 : -1;

      return sortDirection.value === 'asc' ? comparison : -comparison;
    });
  }

  return items;
});

// Filtra els items segons la pàgina actual i el nombre de items per pàgina
const filteredItems = computed(() => {
  const startIndex = (page.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  return filterAndSortItems.value.slice(startIndex, endIndex);
});

// Calcula el nombre total de pàgines
const totalPages = computed(() => {
  return Math.ceil(filterAndSortItems.value.length / pageSize.value)
});


// Canvia la direcció de l'ordenació si la columna ja està seleccionada
const sort = (column: string) => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortColumn.value = column;
    sortDirection.value = 'asc';
  }
};

// Canvia la pàgina actual
const changePage = (newPage: number) => {
  if (newPage < 1 || newPage > totalPages.value) return;
  page.value = newPage;
};

</script>

<template>
  <div class="w-full">
    <Search v-if="props.search" v-model="search" />
    <table class="w-full text-md  bg-white shadow-md rounded mb-4 min-w-full border-collapse">
      <thead>
      <tr>
        <th
            v-for="column in props.columns"
            :key="column.key"
            class="w-1/5 p-2.5 bg-gray-200 border-b text-left"
            @click="column.sortable && sort(column.key)"
        >
          {{ column.label }}
          <span v-if="column.sortable && sortColumn === column.key" v-html="sortDirection === 'asc' ? arrowUp : arrowDown"></span>
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in filteredItems" :key="item._id">
        <td v-for="prop in props.searchProps" :key="prop" class="p-2.5">
          {{ item[prop] }}
        </td>
        <td v-if="item.hasOwnProperty('action')" class="text-center p-2.5">
          <button @click="item.action.action">
            <span v-if="!item.action.actionIcon">{{ item.action.actionText }}</span>
            <span v-else v-html="item.action.actionIcon"></span>
          </button>
        </td>
      </tr>
      </tbody>
    </table>
    <div v-if="!filteredItems.length" class="mt-5 text-center">
      <slot name="not-found">
        No s'han trobat resultats
      </slot>
    </div>
    <pagination :total-pages="totalPages" :page="page" @update-page="changePage"/>
  </div>
</template>
