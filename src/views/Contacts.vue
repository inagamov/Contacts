<template>
    <div>
        <preloader/>

        <!-- Background to close confirmation window -->
        <div class="full-window-size-window" v-if="contactToRemove" @click="closeConfirmationWindow"></div>

        <div class="container">
            <!-- Top bar to add new contact -->
            <form class="contact-list-header" @submit.prevent="addContact">
                <input class="contact-list-header__input" type="text" placeholder="Tyoma Inagamov" v-model="newContactName">
                <button class="contact-list-header__button" type="submit" title="Add contact"><img v-lazyload :data-src="url.add" alt="Add contact"></button>
            </form>

            <!-- Message if user has no contacts -->
            <p v-if="!contacts[0]" class="message-text">You don't have any contacts yet.</p>

            <!-- Contacts list -->
            <div v-for="contact in contacts" :key="contact.id">
                <router-link :to="`/Contact/${contact.id}`" class="contact-item">
                    <vue-initials-img :name="contact.name" :title="contact.name" class="contact-item__initials"/>
                    <p class="contact-item__name" :title="contact.name">{{ contact.name }}</p>
                    <div class="contact-item__button" title="Remove contact"><img v-lazyload :data-src="url.remove" alt="Remove contact" @click.prevent="openConfirmationWindow(contact)"></div>
                </router-link>
            </div>

            <!-- Confirmation window -->
            <div class="modal" v-if="contactToRemove" @keyup.enter="removeContact">
                <p class="message-text">Are you sure you want to remove <span class="modal__highlighted-text">{{ contactToRemove.name }}</span>?</p>

                <div class="modal__actions">
                    <div class="modal__cancel" @click="closeConfirmationWindow">Cancel</div>
                    <div class="modal__continue" @click="removeContact">Remove</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'

// Components
import preloader from '@/components/preloader'

// Contact photo - initials
import VueInitialsImg from 'vue-initials-img'
Vue.use(VueInitialsImg);

// Utils
import lazyload from '@/components/utils/lazyload'

export default {
    name: 'Contacts',
    components: {
        preloader,
    },

    props: {
        preloader: { type: Object, default: () => ({}) }
    },

    data: () => ({
        // Images
        url: {
            add: require('../assets/img/add.png'),
            remove: require('../assets/img/remove.png'),
        },

        // Related to contacts
        contacts: [],
        newContactName: '',
        contactToRemove: null,
    }),

    methods: {
        addContact () {
            // Check if input is empty
            if (this.newContactName != '') {
                // Push new contact to the contacts list
                this.contacts.push({id: this.contacts.length + 1, name: this.newContactName});

                // Clear the input
                this.newContactName = '';
            }
        },

        openConfirmationWindow (contact) {
            // Open confirmation window
            this.contactToRemove = contact;
        },

        closeConfirmationWindow () {
            // Close confirmation window
            this.contactToRemove = null;
        },

        removeContact () {
            // Find the contact in a contacts list
            for (var i = 0; i < this.contacts.length; i++) {
                if (this.contacts[i].name === this.contactToRemove.name) {
                    // Remove found contact from the list
                    this.contacts.splice(i, 1);
                }
            }

            // Close confirmation window
            this.closeConfirmationWindow();
        }
    },

    mounted () {
        // If there already are some contacts in the local storage
        if (localStorage.contacts) {
            this.contacts = JSON.parse(localStorage.contacts);
        }
    },

    watch: {
        // Check for contacts list updates
        contacts (updatedContactsList) {
            localStorage.contacts = JSON.stringify(updatedContactsList);
        }
    },

    directives: {
        lazyload
    }
}
</script>

<style scoped>
    @import '../assets/css/styles.css';
</style>