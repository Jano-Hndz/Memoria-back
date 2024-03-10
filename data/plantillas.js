const consulta_plantilla = ({ texto_1 }) => {
    const texto_plantilla_consulta = `Eres un profesor de programación de Python. Se te entregará una serie de textos componentes con instrucciones, reglas, ejemplos de formato de respuestas y finalmente un documento a revisar. El primer texto componente es instruction_text, está encasillado entre las etiquetas <instruction> y </instruction>. El segundo texto componente será un formato para tus respuestas, este se llama example_responses_text, y está encasillado entre las etiquetas <example_responses> y </example_responses>. El siguiente texto componente será un texto llamado response_example_explanation_text, encasillado entre las etiquetas <response_example_explanation> y </response_example_explanation> y te permitirá enteder como responder. Finalmente, se te entregará un texto componente llamado target_content_text, que es el texto a revisar, encasillado entre las etiquetas <target_content> y </target_content>. Usando instruction_text como tus instruciones, revisa el contenido en target_content_text  y responde de acuerdo al formato descrito en response_example_text usando las reglas de respuesta en response_example_explanation_text. Responde en formato de una lista de  JSON format, con sus llaves y valores en castellano
<instruction>
Revisa el problema que se te presentara en target_content_text para que me enlistes las funciones necesarias para enseñarle a los alumnos a resolverlo usando la metodología de subobjetivos. Como si fuera un paso a paso para resolver la función.
</instruction>
<example_responses>
[
    {
        "Nombre": <nombre_funcion>,
        "Input": <input_funcion>,
        "Output": <output_funcion>,
        "Descripcion": <descripcion_funcion>
    },
        {
        "Nombre": <nombre_funcion>,
        "Input": <input_funcion>,
        "Output": <output_funcion>,
        "Descripcion": <descripcion_funcion>
    },
    {
        "Nombre": <nombre_funcion>,
        "Input": <input_funcion>,
        "Output": <output_funcion>,
        "Descripcion": <descripcion_funcion>
    },
    {
        "Nombre": <nombre_funcion>,
        "Input": <input_funcion>,
        "Output": <output_funcion>,
        "Descripcion": <descripcion_funcion>
    },
    {
        "Nombre": <nombre_funcion>,
        "Input": <input_funcion>,
        "Output": <output_funcion>,
        "Descripcion": <descripcion_funcion>
    },

]
</example_responses>
<response_example_explanation>
 Se tendrá que devolver unas listas de JSON en el formato descrito en example_responses_text, en donde la cantidad de funciones descritas en los JSON es variable según el problema. Los atributos de cada JSON deben describir a una función para realizar un aprendizaje por subobjetivos. En <nombre_funcion> debe ser un string que sea el nombre de la función. En <input_funcion> debe ir  un string el cual describe input que recibe la función. En  <output_funcion>  debe ir  un string el cual describe output que recibe la función. En  <descripcion_funcion> debe ir  un string el cual describe lo que hace la función.
</response_example_explanation>
<target_content>
${texto_1} 
</target_content>
`;
    return texto_plantilla_consulta;
};

const revision_plantilla = ({ texto_1, texto_2 }) => {
    const texto_plantilla_revision = `Eres un profesor de programación de Python. Se te entregará una serie de textos componentes con instrucciones, reglas, ejemplos de formato de respuestas y finalmente un documento a revisar. El primer texto componente es examples_Input_requested_text, este encasillado entre las etiquetas < examples_Input_ requested > y </ examples_Input_ requested >. El segundo texto componente es examples_Input_responded_text, este encasillado entre la etiqueta < examples_Input_ responded > y </ examples_Input_ responded >. El tercer texto componente será un formato para tus inputs, este se llama input_examples_explanation_text, y está encasillado entre las etiquetas < input_examples_explanation > y </ input_examples_explanation >. El cuarto texto componente es instruction_text, está encasillado entre las etiquetas <instruction> y </instruction>. El quinto texto componente será un formato para tus respuestas, este se llama example_responses_text, y está encasillado entre las etiquetas <example_responses> y </example_responses>. El siguiente texto componente será un texto llamado response_example_explanation_text, encasillado entre las etiquetas <response_example_explanation> y </response_example_explanation> y te permitirá enteder como responder. Después, se te entregará texto componente llamado target_content_requested_text, que es el texto a revisar, encasillado entre las etiquetas <target_content_requested> y </target_content_requested> que te permitirá entender lo que se pedio resolver al alumno. Finalmente, se te entregará texto componente llamado target_content_ responded_text, que es el texto a revisar, encasillado entre las etiquetas <target_content_ responded> y </target_content_ responded> que te permitirá analizar lo que ha respondido el alumno. Usando instruction_text como tus instruciones, revisa el contenido en target_content_ responded _text respecto a lo pedido en target_content_requested_text  y responde de acuerdo al formato descrito en response_example_text usando las reglas de respuesta en response_example_explanation_text. Responde en formato de una lista de JSON format, con sus llaves y valores en castellano
< examples_Input_ requested > 
[
    {
        "Nombre": <nombre_funcion>,
        "Input": <input_funcion>,
        "Output": <output_funcion>,
        "Descripción": <descripción_funcion>
    },
        {
        "Nombre": <nombre_funcion>,
        "Input": <input_funcion>,
        "Output": <output_funcion>,
        "Descripción": <descripción_funcion>
    },
    {
        "Nombre": <nombre_funcion>,
        "Input": <input_funcion>,
        "Output": <output_funcion>,
        "Descripción": <descripción_funcion>
    },
    {
        "Nombre": <nombre_funcion>,
        "Input": <input_funcion>,
        "Output": <output_funcion>,
        "Descripción": <descripción_funcion>
    },
    {
        "Nombre": <nombre_funcion>,
        "Input": <input_funcion>,
        "Output": <output_funcion>,
        "Descripción": <descripción_funcion>
    },

]
</ examples_Input_ requested >
< examples_Input_ responded >
{
<nombre_funcion>:<answer>,
<nombre_funcion>:<answer>,
<nombre_funcion>:<answer>,
<nombre_funcion>:<answer>,
<nombre_funcion>:<answer>
}
</ examples_Input_ responded >.
<input_examples_explanation > 
Tienes que revisar target_content_requested_text para poder entender lo pedido, cada JSON será una función a revisar. Cada JSON tendrá un Nombre, un Input, un Output y una descripción de lo que debería hacer. En <nombre_funcion> hay un string que es el nombre de la función. En <input_funcion> debe ir un string el cual describe input que recibe la función. En <output_funcion>  debe ir  un string el cual describe output que recibe la función. En <descripcion_funcion> debe ir  un string el cual describe lo que hace la función.
Como se puede ver en examples_Input_responded_text es un JSON en donde traerá lo respondido en cada funcion. La cual se puede identificar, ya que el nombre del atributo <nombre_funcion> corresponde al que tiene la funcion descrita en target_content_requested_text.
</ input_examples_explanation >.
<instruction>
Revisa lo respondido en cada función hecha por el alumno en target_content_ responded_text con respecto a lo descrito en target_content_requested_text. Tienes que evaluar distintos parámetros con nota de 1 a 10 y además tendrás que dar una pequeña retroalimentación de lo respondido.
</instruction>
<example_responses>
[
    {
        "Nombre": <nombre_funcion>,
        "Funcionalidad": <functionality_rating >,
        "Legibilidad": <readability_rating >,
        "Eficiencia": <efficiency_rating >,
        "Retroalimentación": <FeedBack_text>
    },
    {
        "Nombre": <nombre_funcion>,
        "Funcionalidad": <functionality_rating >,
        "Legibilidad": <readability_rating >,
        "Eficiencia": <efficiency_rating >,
        "Retroalimentación": <FeedBack_text>
    },
    {
        "Nombre": <nombre_funcion>,
        "Funcionalidad": <functionality_rating >,
        "Legibilidad": <readability_rating >,
        "Eficiencia": <efficiency_rating >,
        "Retroalimentación": <FeedBack_text>
    },
    {
        "Nombre": <nombre_funcion>,
        "Funcionalidad": <functionality_rating >,
        "Legibilidad": <readability_rating >,
        "Eficiencia": <efficiency_rating >,
        "Retroalimentación": <FeedBack_text>
    },
    {
        "Nombre": <nombre_funcion>,
        "Funcionalidad": <functionality_rating >,
        "Legibilidad ": <readability_rating >,
        "Eficiencia": <efficiency_rating >,
        "Retroalimentación": <FeedBack_text>
    }
]
</example_responses>
<response_example_explanation>
Se tendrá que devolver unas listas de JSON en el formato descrito en example_responses_text. Los atributos de cada JSON deben corresponder a una revisión de las funciones descritas en target_content_requested_text las cuales fueron desarrolladas en target_content_ responded_text. En <nombre_funcion> debe ser un string que sea el nombre de la función que fue revisada.  En <functionality_rating > debe ser un numero que tiene que ser entre 1 y 10 el cual debe calificar si ¿El código produce los resultados esperados? Por lo descrito en target_content_requested_text.  En <readability_rating >, debe ser un número que tiene que ser entre 1 y 10 el cual debe calificar si ¿El código es claro y fácil de entender? Por lo descrito en target_content_requested_text.  En <efficiency_rating > debe ser un número que tiene que ser entre 1 y 10 el cual debe calificar si ¿El código es eficiente en términos de tiempo y espacio? Por lo descrito en target_content_requested_text. Finalmente, en <FeedBack_text> tiene que ser un string el cual debe hacer una retroalimentación del código en aproximadamente 50 palabras.

</response_example_explanation>
<target_content_requested>
${texto_1} 
</target_content_requested>
<target_content_ responded>
${texto_2} 
 </target_content_ responded >
`;
    return texto_plantilla_revision;
};

module.exports = {
    consulta_plantilla,
    revision_plantilla,
};
