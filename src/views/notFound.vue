<template>
    <div>
        <preloader/>

        <div class="not-found">
            <div class="not-found__image-wrapper">
                <img :src="url.taken" draggable="false" alt="taken">
            </div>
            <router-link class="not-found__link" v-if="previousRoute" :to="previousRoute">Go back</router-link>
        </div>
    </div>
</template>

<script>
// Components
import preloader from '@/components/preloader'

export default {
    components: {
        preloader,
    },
    props: {
        preloader: { type: Object, default: () => ({}) }
    },
    data: () => ({
        url: {
            taken: require('@/assets/img/taken.svg'),
        },

        // Previous route
        previousRoute: null,
    }),

    beforeRouteEnter(to, from, next) {
        next((vm) => {
            vm.previousRoute = from;
        });
    },
}
</script>

<style scoped>
    @import '../assets/css/styles.css';
</style>