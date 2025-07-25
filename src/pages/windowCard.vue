<!-- src/pages/ThumbnailWindowView.vue -->
<template>
    <div class="q-pa-md">
        <div class="row q-col-gutter-md">
            <div v-for="item in visibleItems" :key="item.id" class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
                <WindowCard :item="item" @close="closeItem" @minimize="minimizeItem" @maximize="maximizeItem" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import WindowCard from '../plugins/WindowCard.vue'

const items = reactive([
    {
        id: 1,
        title: 'Product A',
        subtitle: 'Category 1',
        description: 'Details about Product A.',
        image: 'https://cdn.quasar.dev/img/parallax2.jpg',
        minimized: false,
        closed: false,
    },
    {
        id: 2,
        title: 'Product B',
        subtitle: 'Category 2',
        description: 'Details about Product B.',
        image: 'https://cdn.quasar.dev/img/quasar.jpg',
        minimized: false,
        closed: false,
    },
])

const visibleItems = computed(() => items.filter(i => !i.closed))

function closeItem(id) {
    const item = items.find(i => i.id === id)
    if (item) item.closed = true
}

function minimizeItem(id) {
    const item = items.find(i => i.id === id)
    if (item) item.minimized = true
}

function maximizeItem(id) {
    const item = items.find(i => i.id === id)
    if (item) item.minimized = false
}
</script>
