<template>
    <div class="load load-a">
        <div id="loader"></div>
    </div>
</template>

<style scoped>
    .load {
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 3px;
        opacity: 0;
        visibility: hidden;
        -webkit-transition: 0.4s;
        -o-transition: 0.4s;
        transition: 0.4s;
        z-index: 102974125;
        -webkit-animation: opacity_bg 0.8s ease;
        animation: opacity_bg 0.8s ease;
    }

    @-webkit-keyframes opacity_bg {
        0% {
            opacity: 1;
            visibility: visible;
        }
        100% {
            opacity: 0;
            visibility: hidden;
        }
    }

    @keyframes opacity_bg {
        0% {
            opacity: 1;
            visibility: visible;
        }
        100% {
            opacity: 0;
            visibility: hidden;
        }
    }

    .load div {
        width: 100%;
        height: 3px;
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
    }

    .load div:after {
        content: "";
        position: absolute;
        display: block;
        height: 100%;
        background: -webkit-linear-gradient(-45deg, #3778ff, #1e59c9);
        left: 0%;
        right: 100%;
        -webkit-animation: loading 0.8s ease infinite;
        animation: loading 0.8s ease infinite;
    }

    @-webkit-keyframes loading {
        0% {
            left: 0;
            right: 100%;
        }
        50% {
            left: 0;
            right: 0;
        }
        100% {
            left: 100%;
            right: 0;
        }
    }

    @keyframes loading {
        0% {
            left: 0;
            right: 100%;
        }
        50% {
            left: 0;
            right: 0;
        }
        100% {
            left: 100%;
            right: 0;
        }
    }
</style>