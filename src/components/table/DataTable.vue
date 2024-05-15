<script setup lang="ts">
import { ref, computed, watch } from 'vue';
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
// currentPage: Pàgina actual. Per defecte: 1
//            Aquesta propietat s'utilitza per mantenir la pàgina actual quan es refresca la página o es vol compartir.
//            S'ha de passar com a propietat i s'ha de gestionar des del component pare amb l'event updatePage

const props = withDefaults(
    defineProps<{
      items: any[];
      columns: Record<string, any>[];
      searchProps?: string[];
      search?: boolean;
      pagination?: boolean;
      currentPage?: number;
    }>(),
    {
      pagination: false,
      search: false
    }
);

const emit = defineEmits(['updateQuery']);

const searchString = ref<string>('');
const sortColumn = ref<string>('');
const sortDirection = ref<'asc' | 'desc'>('asc');
const page = ref(props.currentPage || 1);
const pageSize = ref(5);

// Filtra els items segons el search value i els ordena segons la columna seleccionada
// Només es pot cercar en les propietats indicades a searchProps i els valors han de ser string o number
// Si la columna és sortable, es canvia la direcció de l'ordenació
const filterAndSortItems = computed(() => {
  let items = [...props.items];

  if (searchString.value && props.searchProps) {
    items = items.filter(item => {
      return props.searchProps?.some(prop => {
        if (!item[prop]) {
          return false;
        } else if (typeof item[prop] === 'number') {
          return item[prop].toString().includes(searchString.value);
        } else if (typeof item[prop] === 'string') {
          return item[prop].toLowerCase().includes(searchString.value.toLowerCase());
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
// Si hi havia currentPage com a query param, propaga l'event updateQuery al parent  per actualitzar la query
const changePage = (newPage: number) => {
  if (newPage < 1 || newPage > totalPages.value) return;
  page.value = newPage;
  if(props.currentPage) updateQuery({currentPage: newPage});
};

const updateQuery = (query: Record<string, any>) => {
  emit('updateQuery', query);
};

// Aquí es vigila si la pàgina actual és més gran que el nombre total de pàgines
// Si és així, es posa la pàgina actual com a última pàgina i es propaga l'event updateQuery al parent
watch([filterAndSortItems, searchString], () => {
  if (page.value > totalPages.value && totalPages.value !== 0) {
    page.value = totalPages.value;
    updateQuery({ currentPage: page.value })
  }
}, { immediate: true });

</script>

<template>
  <div class="w-full overflow-x-auto">
    <Search v-if="props.search" v-model="searchString"/>
    <div class="overflow-x-auto max-h-[calc(100vh-200px)] min-h-[295px]">
      <table class="w-full text-md bg-white shadow-md rounded mb-4 min-w-full border-collapse">
        <thead>
        <tr>
          <th
              v-for="(column, index) in props.columns"
              :key="column.key"
              class="p-2.5 bg-gray-200 border-b text-left"
              @click="column.sortable && sort(column.key)"
              :class="{'rounded-tl-lg': index === 0, 'rounded-tr-lg': index === props.columns.length - 1}"
          >
            <div class="flex justify-items-start w-auto content-center gap-1">
              {{ column.label }}
              <span v-if="column.sortable && sortColumn === column.key" v-html="sortDirection === 'asc' ? arrowUp : arrowDown"></span>
            </div>

          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, index) in filteredItems" :key="item._id" class="hover:bg-blue-50" :class="{'bg-gray-100': index % 2 === 0}">
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
    </div>
    <div v-if="!filteredItems.length" class="mt-5 text-center">
      <slot name="not-found">
        No s'han trobat resultats
      </slot>
    </div>
    <Pagination :total-pages="totalPages" :page="page" @update-page="changePage"/>
  </div>
</template>
