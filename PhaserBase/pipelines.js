var GrayscalePipeline = new Phaser.Class({

    Extends: Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline,

    initialize:

    function GrayscalePipeline (game)
    {
        Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline.call(this, {
            game: game,
            renderer: game.renderer,
            fragShader:`
                precision mediump float;
                uniform sampler2D uMainSampler;
                varying vec2 outTexCoord;
                void main(void) {
                //vec2 coord = vec2(outTexCoord.x, 1.0-outTexCoord.y);
                vec4 color = texture2D(uMainSampler, outTexCoord);
                float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
                float gray2 = (color.r + color.g + color.b) / 3.0;
                vec2 unionCoord = outTexCoord - vec2(0.0,0.0);
                float pct = sqrt(unionCoord.x * unionCoord.x + unionCoord.y * unionCoord.y);
                gl_FragColor = vec4(vec3(gray2) * (1.0-pct), 1.0);
                }`
        });
    }
});
