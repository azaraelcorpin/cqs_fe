<!-- src/components/WindowCard.vue -->
<template>
    <q-card class="q-hoverable shadow-3">
        <!-- Header with Window Controls -->
        <q-card-section class="row items-center justify-between bg-grey-3">
            <div class="row items-center">
                <q-btn flat round dense size="sm" color="red" icon="close" @click="$emit('close', item.id)" />
                <q-btn flat round dense size="sm" color="orange" icon="remove" @click="$emit('minimize', item.id)" />
                <q-btn flat round dense size="sm" color="green" icon="fullscreen" @click="$emit('maximize', item.id)" />
            </div>
            <div class="text-weight-bold ellipsis">{{ item.title }}</div>
        </q-card-section>

        <!-- Body -->
        <q-slide-transition>
            <div v-show="!item.minimized">
                <q-img :src="item.image" ratio="16/9" />
                <q-card-section>
                    <div class="text-subtitle2">{{ item.subtitle }}</div>
                    <div class="text-body2">{{ item.description }}</div>
                </q-card-section>
            </div>
        </q-slide-transition>
    </q-card>
</template>

<script setup>
defineProps({
    item: {
        type: Object,
        required: true,
    },
})

defineEmits(['close', 'minimize', 'maximize'])
</script>
