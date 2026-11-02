<script lang="ts">
  import { menuOpenState } from '../State/MenuOpener.svelte'

  const onclick = () => {
    if(menuOpenState.backButtonMode)
    {
      menuOpenState.backButtonMode = false;

      if(menuOpenState.backButtonCallback== null)
      {
        throw "No callback for menubutton->back";
      }

      menuOpenState.backButtonCallback();

      menuOpenState.backButtonCallback= null;
      
      if (menuOpenState.MenuButtonDown) menuOpenState.MenuButtonDown = false;

      return;
    }

    menuOpenState.MenuButtonOpen = !menuOpenState.MenuButtonOpen;
  }
</script>

<label class="menubutton" aria-label="Menu" class:opened={menuOpenState.MenuButtonOpen} class:backbutton={menuOpenState.backButtonMode} class:downbutton={menuOpenState.MenuButtonDown}>
  <button aria-label="Menu" {onclick}></button>

  <svg class="menusymbol" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
    <line stroke-width="2" class="xTop" stroke-linecap="round" stroke-linejoin="round" fill="none" y1="6" y2="6" x1="2" x2="30" />
    <line stroke-width="2" class="xMiddle" stroke-linecap="round" stroke-linejoin="round" fill="none" y1="18" y2="18" x1="2" x2="30" />
    <line stroke-width="2" class="xBottom" stroke-linecap="round" stroke-linejoin="round" fill="none" y1="30" y2="30" x1="2" x2="30" />
  </svg>
</label>


<style>
.menubutton, .backbutton
{
  pointer-events: auto;
  height: 100%;
  overflow: visible;
}
.menubutton button {
  border: none;
  background: none;
  outline: none;
}

.menubutton button:active ~ svg
{
  transition: transform 0.05s;
  transform: scale(0.9,0.9);
}

.menusymbol
{
  margin-left: 10px;
  height: 50%;
  height: max(20px, 50%);

}
.menubutton line
{
  stroke: #ffffff;
  stroke-linecap: round;
}
.menubutton *, .backbutton * 
{
  /*transition: all cubic-bezier(.63,.21,.3,1.05) 0.2s;*/
  transition: all cubic-bezier(.6,.14,.33,.98) 0.2s;
  
}

.opened svg .xTop
{
  transform-origin: center;
  transform: scale(1.1) translate(-25%, 30%) rotate(45deg);
}
.opened svg .xMiddle
{
  transform-origin: center;
  transform: scale(0);
}
.opened svg .xBottom
{
  transform-origin: center;
  transform: scale(1.1) translate(-25%, -25%) rotate(-45deg);
}  
.backbutton > svg .xTop
{
  transform-origin: center;
  transform: scale(0.8) translate(0%, -10%) rotate(-45deg);
}
.backbutton > svg .xMiddle
{
  transform-origin: center;
}
.backbutton > svg .xBottom
{
  transform-origin: center;
  transform: scale(0.8) translate(0%,10%) rotate(45deg);
}  

.downbutton > svg .xTop
{
  transform-origin: center;
  transform: scale(1) translate(-35%, 10%) rotate(90deg);
}
.downbutton > svg .xMiddle
{
  transform-origin: center;
  transform: scale(0.8) translate(32%,25%) rotate(-45deg);
}
.downbutton > svg .xBottom
{
  transform-origin: center;
  transform: scale(0.8) translate(-2%,10%) rotate(45deg);
}  
</style>