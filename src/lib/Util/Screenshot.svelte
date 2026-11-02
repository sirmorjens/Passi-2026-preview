<script lang="ts">
    import * as htmlToImage from 'html-to-image';
    import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';

    const { node } = $props();

    const onclick = () => {
    htmlToImage
      .toPng(node)
      .then((dataUrl) => {
        const img = new Image();
        img.src = dataUrl;
        img.style = "position:absolute;top:20px;left:20px;width: 70%;height:auto";
        document.body.appendChild(img);
      })
      .catch((err) => {
        console.error('oops, something went wrong!', err);
      });
    }
</script>

<button {onclick}>Screenshot</button>

<style>

</style>