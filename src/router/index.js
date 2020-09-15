import Vue from 'vue'
import VueRouter from 'vue-router'

// Importing views
import notFound from '../views/notFound.vue'
import Contacts from '../views/Contacts.vue'
import Contact from '../views/Contact.vue'

Vue.use(VueRouter)

const routes = [
    // Not Found page
    {
        path: "*",
        name: 'notFound',
        component: notFound,
        beforeEnter: (to, from, next) => {
            document.title = 'Contacts - Page not found';
            next();
        },
    },

    // Main page with a list of contacts
    {
        path: '/',
        name: 'Contacts',
        component: Contacts,
        beforeEnter: (to, from, next) => {
            document.title = 'Contacts - main';
            next();
        }
    },

    // Contact info about the contact
    {
        path: '/Contact/:id',
        name: 'Contact',
        component: Contact,
        beforeEnter: (to, from, next) => {
            document.title = `Contact - ${to.params.id}`;
            next();
        }
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
