%lex
%%

\s+                                                     /* skip whitespace */
\r                                                      /* skip whitespace */
\n                                                      /* skip whitespace */
[0-9]+("."[0-9]+)?\b                                    return 'numero'
\"[^\"]*\"|\'[^\']*\'       yytext = yytext.substr(1,yyleng-2); return 'cadena';
"*"                                                     return '*'
"/"                                                     return '/'
"-"                                                     return '-'
"+"                                                     return '+'
"^"                                                     return '^'
"%"                                                     return '%'

"<"                                                     return '<'
">"                                                     return '>'
"<="                                                    return '<='
">="                                                    return '>='
"=="                                                    return '=='
"!="                                                    return '!='

"&&"                                                    return '&&'
"||"                                                    return '||'
"|?"                                                    return '|?'
"&?"                                                    return '&?'
"|&"                                                    return '|&'
"!"                                                     return '!'

"("                                                     return '('
")"                                                     return ')'
"{"                                                     return '{'
"}"                                                     return '}'
"["                                                     return '['
"]"                                                     return ']'
":"                                                     return ':'
";"                                                     return ';'
".."                                                    return '..'
"."                                                     return '.'
","                                                     return ','
"="                                                     return '='

"num"                                                   return 'num'
"str"                                                   return 'str'
"bool"                                                  return 'bool'
"void"                                                  return 'void'
"array"                                                 return 'array'
"of"                                                    return 'of'
"element"                                               return 'element'
"NULL"                                                  return 'NULL'
"create"                                                return 'create'
"if"                                                    return 'if'
"then"                                                  return 'then'
"else"                                                  return 'else'
"switch"                                                return 'switch'
"case"                                                  return 'case'
"default"                                               return 'default'
"break"                                                 return 'break'
"continue"                                              return 'continue'
"return"                                                return 'return'
"while"                                                 return 'while'
"do"                                                    return 'do'
"repeat"                                                return 'repeat'
"until"                                                 return 'until'
"for"                                                   return 'for'
"loop"                                                  return 'loop'
"count"                                                 return 'count'
"whilex"                                                return 'whilex'
"Principal"                                             return 'principal'

"outStr"                                                return 'outStr'
"outNum"                                                return 'outNum'
"inStr"                                                 return 'inStr'
"inNum"                                                 return 'inNum'
"show"                                                  return 'show'
"getRandom"                                             return 'getRandom'
"getLength"                                             return 'getLength'

"NullPointerException"                                  return 'NullPointerException'
"MissingReturnStatement"                                return 'MissingReturnStatement'
"ArithmeticException"                                   return 'ArithmeticException'
"StackOverFlowException"                                return 'StackOverFlowException'
"HeapOverFlowException"                                 return 'HeapOverFlowException'
"PoolOverFlowException"                                 return 'PoolOverFlowException'
"throws"                                                return 'throws'

[a-zA-Z]([a-zA-Z0-9_])*                                 return 'id'
<<EOF>>                                                 return 'EOF'
.                                                       return 'INVALID'

/lex

/* operator associations and precedence */

%left '||' '|?'
%left '&&' '&?'
%left '|&'
%right '!'
%left '==' '!=' '>' '<' '>=' '<='
%left '+' '-'
%left '*' '/'
%right '^'
%right '%'
%left UMINUS

%start INICIO

%% /* language grammar */

INICIO          :   LCUERPOGEN EOF {return $1;};

LCUERPOGEN      :   LCUERPOGEN CUERPOGEN { 
                        $1.hijos.push($2);
                        $$ = $1;
                    }
                |   CUERPOGEN { $$ = {nombre : "LCUERPOGEN", hijos:[$1]}; };

CUERPOGEN       :   DECVAR { $$ = $1; }
                |   DECFUN { $$ = $1; }
                |   DECARR { $$ = $1; }
                |   PRINCIPAL { $$ = $1; };

DECVAR          :   TIPO LVARIABLES ASIG ';';
ASIG            :   ':' VALOR
                |   'create' '(' id ')'
                |   ;
LVARIABLES      :   LVARIABLES ',' id { 
                        $1.hijos.push($3);
                        $$ = $1;
                    }
                |   id { $$ = {nombre : "LVARIABLES", hijos:[$1]}; };

DECARR          :   'array' ':' id LCORCHETES 'of' TIPO{
                        $$ = {
                            nombre : "array",
                            tipo : $6,
                            valor : $3,
                            hijos : [$4]
                        };
                    };
LCORCHETES      :   LCORCHETES '[' RANGO ']' {
                        $1.hijos.push($3);
                        $$ = $1;
                    }
                |   '[' RANGO ']' { $$ = {nombre : "LCORCHETES", hjos : [$2]}; };
RANGO           :   numero { $$ = {nombre : "rango", hijos : [$1]}; }
                |   numero '..' numero { $$ = {nombre : "rango", hijos : [$1, $3]}; }
                |   { $$ = {nombre : "rango", hijos : []}; };

DECFUN          :   TIPOFUN L ':' id '(' LPAR ')' '{' LCUERPO '}' {
                        $$ = {
                            nombre : "funcion",
                            id : $4,
                            tipo : $1,
                            hijos : [$6, $9]
                        };
                        if($2 !== null)
                            $$.hijos.push($2);
                    };
TIPOFUN         :   'void' { $$ = $1; }
                |   TIPO { $$ = $1; };
L               :   LCORCHETES { $$ = $1; }
                |   { $$ = null; };
LPAR            :   LPAR ',' TIPO id L {
                        var id = { nombre : "id", tipo : $3, valor : $4, hijos : [] };
                        if($5 !== null)
                            id.hijos.push($5);
                        $1.hijos.push(id);
                        $$ = $1;
                    }
                |   TIPO id L {
                        var id = { nombre : "id", tipo : $1, valor : $2, hijos : [] };
                        if($3 !== null)
                            id.hijos.push($3);
                        $$ = {
                            nombre : "LPAR",
                            hijos : [id]
                        };
                    }
                |   { $$ = {nombre : "LPAR", hijos : []}; };

TIPO            :   'num' { $$ = $1; }
                |   'str' { $$ = $1; }
                |   'bool' { $$ = $1; }
                |   id { $$ = $1; };

PRINCIPAL       :   'principal' '(' ')' '{' LCUERPO '}' { $$ = {nombre : "principal", hijos : [$5]}; };

LCUERPO         :   LCUERPO CUERPO { 
                        $1.hijos.push($2);
                        $$ = $1;
                    }
                |   CUERPO { $$ = {nombre : "LCUERPO", hijos:[$1]}; };

CUERPO          :   ASIGNACION ';' { $$ = $1; }
                |   DECVAR { $$ = $1; }
                |   DECARR { $$ = $1; }
                |   SI { $$ = $1; }
                |   SELECCION { $$ = $1; }
                |   MIENTRAS { $$ = $1; }
                |   HACER { $$ = $1; }
                |   REPETIR { $$ = $1; }
                |   PARA { $$ = $1; }
                |   LOOP { $$ = $1; }
                |   CONTAR { $$ = $1; }
                |   HACERX { $$ = $1; }
                |   'continue' ';' { $$ = { nombre : "continue"}; }
                |   'break' ';' { $$ = { nombre : "break"}; }
                |   'return' VALOR ';' { $$ = { nombre : "return", hijos : [$2]}; }
                |   'return' ';' { $$ = { nombre : "return"}; };

ASIGNACION      :   id '=' VALOR;

SI              :   'if' '(' VALOR ')' 'then' '{' LCUERPO '}' ELSE {
                        $$ = {
                            nombre : "if",
                            hijos : [$3, $7]
                        };
                        if($9 !== null)
                            $$.hijos.push($9);
                    };
ELSE            :   'else' '{' LCUERPO '}' { $$ = $3; }
                |   { $$ = null; };

SELECCION       :   'switch' '(' VALOR ',' VALOR ')' '{' LCASOS DEFECTO'}';
LCASOS          :   LCASOS CASO
                |   CASO;
CASO            :   'case' VALOR ':' LCUERPO;
DEFECTO         :   'default' ':' LCUERPO
                |   ;

MIENTRAS        :   'while' '(' VALOR ')' '{' LCUERPO '}';

HACER           :   'do' '{' LCUERPO '}' 'while' '(' VALOR ')';

REPETIR         :   'repeat' '{' LCUERPO '}' 'until' '(' VALOR ')';

PARA            :   'for' '(' ASIGPARA ';' VALOR ';' ASIGNACION ')';
ASIGPARA        :   ASIGNACION
                |   num id ':' VALOR;
LOOP            :   'loop' id '{' LCUERPO '}';

CONTAR          :   'count' '(' VALOR ')' '{' LCUERPO '}';

HACERX          :   'do' '{' LCUERPO '}' 'whilex' '(' VALOR ')';

VALOR           :   VALOR '||' VALOR { $$ = {nombre :$2, hijos:[$1, $3]}; }
                |   VALOR '|&' VALOR { $$ = {nombre :$2, hijos:[$1, $3]}; }
                |   VALOR '&&' VALOR { $$ = {nombre :$2, hijos:[$1, $3]}; }
                |   VALOR '|?' VALOR { $$ = {nombre :$2, hijos:[$1, $3]}; }
                |   VALOR '&?' VALOR { $$ = {nombre :$2, hijos:[$1, $3]}; }
                |   '!' VALOR { $$ = {nombre :$1, hijos:[$2]}; }
                |   REL { $$ = $1; };

REL             :   E OPREL E { $$ = {nombre : $2, hijos:[$1, $3]}; }
                |   E { $$ = $1; };
OPREL           :   '<' { $$ = '<'; }
                |   '>' { $$ = '>'; }
                |   '<=' { $$ = '<='; }
                |   '>=' { $$ = '>='; }
                |   '==' { $$ = '=='; }
                |   '!=' { $$ = '!='; };

E               :   E '+' E { $$ = {nombre :$2, hijos:[$1, $3]}; }
                |   E '-' E { $$ = {nombre :$2, hijos:[$1, $3]}; }
                |   E '*' E { $$ = {nombre :$2, hijos:[$1, $3]}; }
                |   E '/' E { $$ = {nombre :$2, hijos:[$1, $3]}; }
                |   E '%' E { $$ = {nombre :$2, hijos:[$1, $3]}; }
                |   E '^' E { $$ = {nombre :$2, hijos:[$1, $3]}; }
                |   numero { $$ = {nombre : "numero", valor : Number(yytext)}; }
                |   cadena { $$ = {nombre : "cadena", valor : $1}; }
                |   LID { $$ = $1; }
                |   '(' VALOR ')' { $$= $2; };

LID             :   LID '.' id { 
                        $1.hijos.push($3);
                        $$ = $1;
                    }
                |   id { $$ = {nombre : "LID", hijos:[$1]}; };
                