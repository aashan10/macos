/* @refresh reload */
import { render } from 'solid-js/web'
import './index.css'
import Main from './components/main'
import { attachDevtoolsOverlay } from '@solid-devtools/overlay';

attachDevtoolsOverlay({

});

const root = document.getElementById('root')

render(() => <Main />, root!)

