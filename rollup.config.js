//import terser from '@rollup/plugin-terser';
import commonjs from '@rollup/plugin-commonjs';

export default {
    input:'src/index.js',
    plugins:[
        /*terser({
            keep_classnames:true,
            keep_fnames:true,
            compress:{
                ecma:6,
                keep_classnames:true,
                keep_fnames:true,
                evaluate:true
            },
            module:true
        }),*/
        commonjs()
    ],
    output:[
        {
            file:'index.js',
            format:'esm',
        }
    ]
}