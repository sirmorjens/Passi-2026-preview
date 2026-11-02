<script lang="ts">
  import { Spring } from 'svelte/motion'
  import { duduState } from './DuduState.svelte'

  // head
  let animation = true;
  let startled = $state(false)
  let really_startled = $state(false)
  let sad = $state(false)
  let startled_count = 0;
  let blink = $state(false);
  let talking = $state(false)
  let antennaBasis = [15.55, 6.02]
  let antenna = Spring.of(() => {return [0,0]}, {stiffness: 0.6, damping: 0.4})

  // exported functions that main body can call
  export const activate = (magnitude = [10,10]) => {
    antenna.set([Math.random()*0.4*magnitude[0]*-1, Math.random()*1.5*magnitude[1]*-.4]).then(() => {antenna.target = [0,0]}).catch(() => {})

    if(startled)
    {
      startled_count += 1;
    }

    if (startled_count > 5)
    {
      really_startled = true;
    }
    blink = true;
    startled= true;
    talking = false;
  }

  export const talk = () => {
    talking = true;
  }
  export const shutUp = () => 
  {
    talking = false;
  }
  export const setSad = () => {
    sad = true;
  }

  const blinkInTimeout = () => 
  {
    if (!animation)
    {
      return;
    }

    if( blink == null )
    {
      return
    }

    blink = true;

    setTimeout(blinkOutTimeout, (Math.random()+0.6)*300);
  };

  const blinkOutTimeout = () => 
  { 

    if (!animation)
    {
      return;
    }

    if( blink == null )
    {
      return
    }

    startled = false;
    really_startled = false;
    startled_count = 0;
    blink = false;

    setTimeout(blinkInTimeout, (Math.random()+0.6)*3300);
  };
  $effect(() => {
    setTimeout(blinkInTimeout, (Math.random()+0.6)*3300);

    return () => {animation=false;};
  });

  // /head
</script>
<svg style="overflow:visible" id="DuduHead" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35 42" height=200>
  <defs>
    <style>
      .cls-1 {
        fill: #f2eded;
      }

      .cls-2 {
        fill: #3c00be;
      }

      .cls-3 {
        fill: #7c1a1a;
      }

      .cls-4, .cls-524 {
        fill: none;
        stroke-miterlimit: 10;
        stroke-width: 2px;
        stroke-linecap: round;
      }

    </style>
  </defs>

  <radialGradient id="duduAntenna">
    <stop offset="0.3" stop-color={duduState.antennacolor.colors[duduState.antennacolor.selected].fs} />
    <stop offset="1" stop-color={duduState.antennacolor.colors[duduState.antennacolor.selected].ls} />
  </radialGradient>
  <ellipse id="Head" fill="url(#dudu1)" cx="17.24" cy="27.11" rx="16.83" ry="14.94"/>
  <g id="faceGroup" style:transform={`translate(${antenna.current[0]*-0.2}px, ${antenna.current[1]*0.2}px)`}>
  <ellipse id="Face" fill="#ffffff" cx="17.34" cy="29.13" rx="12.09" ry="9.07"/>
  {#if !blink && !startled && !sad }  
  <path id="le" stroke={duduState.eyecolor.colors[duduState.eyecolor.selected]} fill="none" class="cls-524"  d="m8.32,30.9s-.29-2.42,1.99-2.98c2.6-.64,3.07,2.13,3.07,2.13" />

  <path id="re" stroke={duduState.eyecolor.colors[duduState.eyecolor.selected]} fill="none" class="cls-524" d="m21.6,29.61s.44-2.39,2.78-2.26c2.67.16,2.3,2.94,2.3,2.94"/>
  {/if}

  {#if blink && !startled}
  <path id="le_s" stroke={duduState.eyecolor.colors[duduState.eyecolor.selected]} fill="none" class="cls-524" d="m8.32,30.9s2.09-.15,2.4-.21c.83-.16,2.66-.64,2.66-.64"/>
  <path id="re_s" stroke={duduState.eyecolor.colors[duduState.eyecolor.selected]} fill="none" class="cls-524" d="m21.6,29.61s1.95.66,2.37.68c.47.03,2.72,0,2.72,0"/>
  {/if}
  {#if startled}
    <circle id="sle" fill={duduState.eyecolor.colors[duduState.eyecolor.selected]} cx=11 cy=29 r=3.5 />
    <circle id="sre" fill={duduState.eyecolor.colors[duduState.eyecolor.selected]} cx=24 cy=29 r=3.5 />
    <circle id="sleg" fill="#ffffff" cx=10.3 cy=28.5 r=0.8 />
    <circle id="sreg" fill="#ffffff" cx=23.3 cy=28.5 r=0.8 />
  {/if}
  {#if sad && !blink}
    <path class="cls-524" d="M8.32031 30.9C8.32031 30.9 9.018 31.9083 11.0326 31.6352C13.0473 31.362 13.3803 30.05 13.3803 30.05" stroke={duduState.eyecolor.colors[duduState.eyecolor.selected]} stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"/>
    <path class="cls-524" d="M21.5999 29.61C21.5999 29.61 22.847 30.9181 24.1104 30.9864C25.3738 31.0547 26.6799 30.29 26.6799 30.29" stroke={duduState.eyecolor.colors[duduState.eyecolor.selected]} stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"/>
  {/if}  

  {#if really_startled}
  <circle id="mouth" cx=17.5 cy=34 r=1.8 fill="#000000" />

    <!--<circle id="sle" fill="#3c00be" cx=11 cy=29.5 r=4.4 />
    <circle id="sre" fill="#3c00be" cx=24 cy=29.5 r=4.4 />
    <circle id="sleg" fill="#ffffff" cx=11.0 cy=29.5 r=0.9 />
    <circle id="sreg" fill="#ffffff" cx=24.0 cy=29.5 r=0.9 />-->
  {/if}
  {#if talking}
  <circle id="mouth" cx=17.5 cy=35 r=1.3 fill="#000000">
    <animate attributeName="r" values="1.3;0.9;1.4;0.8;0.4;0.9;1.4;1" calcMode="discrete" dur="1.4s" repeatCount="indefinite" />
  </circle>
  {/if}
  </g>
  <path id="AntenniVarsi" class="cls-524" d="M 16.2 13.46 S 16.0 12.0 {antennaBasis[0] + antenna.current[0]} {antennaBasis[1] + antenna.current[1]}" stroke={duduState.antennacolor.colors[duduState.antennacolor.selected].stem} />
  <!-- absolute coords for antenna -->
  <ellipse id="Antenni" cx={antennaBasis[0] + antenna.current[0]} cy={antennaBasis[1] + antenna.current[1]} rx="2.96" fill="url(#duduAntenna)" ry="3.08"/>



  <!-- hat -->
  <!--
    <path d="M15.1603 16.2773H-2.11816C-1.31817 11.3178 5.80108 11.0778 7.88089 11.0778C9.96071 11.0778 9.16078 2.67855 9.96071 1.63864C10.7606 0.598724 17.4001 0.998692 20.0398 1.63864C22.6796 2.27858 21.7997 10.8378 27.0792 11.0778C31.3028 11.2698 33.7986 13.4509 34.5186 14.5175C30.4389 15.1041 20.8558 16.2773 15.1603 16.2773Z" fill="#681919"/>
  -->
  <!-- hat
<path d="M15.1603 16.2773H-2.11816C-1.31817 11.3178 5.80108 11.0778 7.88089 11.0778C9.96071 11.0778 9.16078 2.67855 9.96071 1.63864C10.7606 0.598724 17.4001 0.998692 20.0398 1.63864C22.6796 2.27858 21.7997 10.8378 27.0792 11.0778C31.3028 11.2698 33.7986 13.4509 34.5186 14.5175C30.4389 15.1041 20.8558 16.2773 15.1603 16.2773Z" fill="#681919"/>
<path d="M10.1993 2.00703C10.5278 1.51477 11.5271 1.36499 12.7108 1.36499C12.7108 1.36499 11.5023 2.61131 11.4645 6.04808C11.4267 9.48484 12.8748 10.8381 12.8748 10.8381C11.5392 11.2404 11.0556 11.5023 9.10889 11.0795C9.88129 10.114 10.0061 2.2967 10.1993 2.00703Z" fill="#92962A"/>
<path d="M1.76709 12.6007C3.21871 11.722 6.31985 11.5819 7.68897 11.6217C6.70201 11.9003 4.45588 12.5529 3.36706 12.935C2.27824 13.317 -0.190696 14.9884 -1.28906 15.7764C-0.875185 15.084 0.315475 13.4794 1.76709 12.6007Z" fill="#9AAE43" fill-opacity="0.27"/>
<path d="M22.4218 15.0071C23.9799 14.8772 30.3213 14.1144 33.2973 13.7491L33.7843 14.1955C30.6596 14.5878 23.9395 15.4129 22.0567 15.5752C19.7031 15.7781 3.0081 16.129 3.29216 16.0072C3.57621 15.8855 20.4742 15.1694 22.4218 15.0071Z" fill="#6F8D54"/>
<path d="M15.0507 -0.936841C15.1022 -0.39772 14.6871 0.806795 14.4731 1.34166C15.607 1.58771 17.6821 1.93217 17.5537 1.34166C17.3933 0.603524 16.6552 -0.262884 16.8798 -0.936841C17.1044 -1.6108 18.4523 -2.28465 19.6397 -2.63767C20.8271 -2.99069 19.1261 -5.52594 16.27 -5.52594C13.4138 -5.52594 12.0339 -2.86231 12.4511 -2.63767C12.8683 -2.41303 14.9863 -1.61074 15.0507 -0.936841Z" fill="url(#paint0_radial_156_3605)"/>
<path d="M20.9884 4.66804C20.6873 5.20996 18.2386 5.8723 19.1417 5.47091C20.2123 4.99504 20.3368 4.12638 20.6164 2.28046C21.2554 2.57976 22.6136 8.44438 24.1838 9.88895C24.8039 11.8546 20.4267 10.655 20.9884 10.4284C22.1325 9.96677 21.771 6.99627 21.49 7.81918C21.209 8.64209 18.8607 7.91953 19.2822 7.81918C19.7037 7.71882 20.9884 5.93251 20.9884 4.66804Z" fill="#41B49D"/>
<path d="M17.8625 5.58917C18.7242 6.4783 16.5838 8.5383 16.9886 8.38608C17.3934 8.23385 18.866 7.49432 18.8977 7.89408C18.9294 8.29385 18.1642 10.1456 17.1407 10.3687C16.1172 10.5918 13.6563 10.248 14.7145 9.77281C15.7726 9.2976 13.655 9.12494 14.0514 8.29636C14.4478 7.46777 13.2577 6.46454 14.0332 5.82053C14.8088 5.17651 16.755 3.11932 17.5159 3.69427C18.1246 4.15423 16.1395 5.91909 15.0709 6.74402" stroke="#FF8D8D"/>

<defs>
<radialGradient id="paint0_radial_156_3605" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(16.2002 -1.92911) rotate(90) scale(3.59683 3.82224)">
<stop stop-color="#6FFF00"/>
<stop offset="1" stop-color="#7300FF"/>
</radialGradient>

</defs>
-->

  
  <!-- /hat -->
</svg> 
<style>
  svg {
    height: 90px;
  }
</style>