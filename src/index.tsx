/* @refresh reload */
import { render } from 'solid-js/web'
import './index.css'
import Main from './components/main'
import { createPopper } from '@popperjs/core'

const root = document.getElementById('root')

render(() => <Main />, root!)

setTimeout(() => {

    console.log(document.querySelectorAll('.tooltip'));

    document.querySelectorAll('.tooltip').forEach(el => {
        const target = el.getAttribute('data-tooltip-target');

        if (!target) return;

        const targetElement = document.querySelector(target);
        if (!targetElement) return;

        // @ts-ignore
        createPopper(targetElement, el, {
            placement: 'top'
        });
    });
}, 2000);
