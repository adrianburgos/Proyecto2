%lex
%%

\s+                                                     /* skip whitespace */
\r                                                      /* skip whitespace */
\n                                                      /* skip whitespace */
"%%"[^\n]*\n                                            /* skip comment */
"¿¿"[^"??"]*"??"                                        /* skip comment */
[0-9]+("."[0-9]+)?\b                                    return 'numero'
\"[^\"]*\"|\'[^\']*\'       yytext = yytext.substr(1,yyleng-2); return 'cadena';
"*"                                                     return '*'
"/"                                                     return '/'
"-"                                                     return '-'
"+"                                                     return '+'
"^"                                                     return '^'
"%"                                                     return '%'

"<="                                                    return '<='
">="                                                    return '>='
"<"                                                     return '<'
">"                                                     return '>'
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
"true"                                                  return 'true'
"false"                                                 return 'false'
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
%right '('
%left UMINUS

%start INICIO

%% /* language grammar */

INICIO          :   LCUERPOGEN EOF {return $1;};

LCUERPOGEN      :   LCUERPOGEN CUERPOGEN {
                        $1.hijos.push($2);
                        $$ = $1;
                    }
                |   CUERPOGEN { $$ = {nombre : "LCUERPOGEN", hijos:[$1]}; };

CUERPOGEN       :   DECVAR ';'{ $$ = $1; }
                |   DECFUN { $$ = $1; }
                |   DECARR ';'{ $$ = $1; }
                |   PRINCIPAL { $$ = $1; };

DECVAR          :   TIPO LVARIABLES ASIG {
                        $$ = {
                            nombre : "DECVAR",
                            tipo : $1,
                            hijos : [$2, $3]
                        };
                    };
ASIG            :   ':' VALOR { $$ = $2; }
                |   ':' 'create' '(' id ')' { $$ = {nombre : "NUEVO", id : $4}; }
                |   { $$ = {nombre : "NULL", valor : "NULL"}; };
LVARIABLES      :   LVARIABLES ',' id {
                        var lid = {nombre : "LID", hijos:[$3]};
                        $1.hijos.push(lid);
                        $$ = $1;
                    }
                |   id {
                      var lid = {nombre : "LID", hijos:[$1]};
                      $$ = {nombre : "LVARIABLES", hijos:[lid]};
                    };

DECARR          :   'array' ':' id LCORCHETES 'of' TIPO{
                        $$ = {
                            nombre : "ARRAY",
                            tipo : $6,
                            id : $3,
                            hijos : [$4]
                        };
                    };
LCORCHETES      :   LCORCHETES '[' RANGO ']' {
                        $1.hijos.push($3);
                        $$ = $1;
                    }
                |   '[' RANGO ']' { $$ = {nombre : "LCORCHETES", hijos : [$2]}; };
RANGO           :   numero { $$ = {nombre : "RANGO", hijos : ["0", $1]}; }
                |   numero '..' numero { $$ = {nombre : "RANGO", hijos : [$1, $3]}; }
                |   { $$ = {nombre : "RANGO", hijos : []}; };

DECFUN          :   TIPOFUN L ':' id '(' LPAR ')' '{' LCUERPO '}' {
                        $$ = {
                            nombre : "FUNCION",
                            id : $4,
                            tipo : $1,
                            hijos : [$6, $9]
                        };
                        for(var i = 0; i < $6.hijos.length; i++)
                        {
                          $$.id += "-" + $6.hijos[i].tipo;
                        }
                        if($2 !== null)
                            $$.hijos.push($2);
                    };
TIPOFUN         :   'void' { $$ = $1; }
                |   TIPO { $$ = $1; };
L               :   LCORCHETES { $$ = $1; }
                |   { $$ = null; };
LPAR            :   LPAR ',' TIPO id L {
                        var id = { nombre : "ID", tipo : $3, valor : $4, hijos : [] };
                        if($5 !== null)
                            id.hijos.push($5);
                        $1.hijos.push(id);
                        $$ = $1;
                    }
                |   TIPO id L {
                        var id = { nombre : "ID", tipo : $1, valor : $2, hijos : [] };
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
                |   LID {
                      if($1.hijos.length >= 2)
                      {//existe un error la variable no fue declarada correctamente
                        var er = {
                          tipo: "Error Semantico",
                          descripcion: "No se puede declarar una variable de tipo [" + $1.hijos.join(".") + "]",
                          fila: 0,
                          columna: 0
                        };
                        agregarError(er);
                      }
                      $$ = $1.hijos[0];

                    };

PRINCIPAL       :   'principal' '(' ')' '{' LCUERPO '}' { $$ = {nombre : "PRINCIPAL", hijos : [$5]}; };

LCUERPO         :   LCUERPO CUERPO {
                        $1.hijos.push($2);
                        $$ = $1;
                    }
                |   CUERPO { $$ = {nombre : "LCUERPO", hijos:[$1]}; };

CUERPO          :   ASIGNACION ';' { $$ = $1; }
                |   DECVAR ';'{ $$ = $1; }
                |   DECARR ';'{ $$ = $1; }
                |   SI { $$ = $1; }
                |   SELECCION { $$ = $1; }
                |   MIENTRAS { $$ = $1; }
                |   HACER { $$ = $1; }
                |   REPETIR { $$ = $1; }
                |   PARA { $$ = $1; }
                |   LOOP { $$ = $1; }
                |   CONTAR { $$ = $1; }
                |   HACERX { $$ = $1; }
                |   LLAMADO ';' { $$ = $1; }
                |   'continue' ';' { $$ = { nombre : "CONTINUE"}; }
                |   'break' ';' { $$ = { nombre : "BREAK", hijos : []}; }
                |   'break' id ';' { $$ = { nombre : "BREAK", hijos : [$2]}; }
                |   'return' VALOR ';' { $$ = { nombre : "RETURN", hijos : [$2]}; }
                |   'return' ';' { $$ = { nombre : "RETURN", hijos : []}; };

ASIGNACION      :   LID '=' VALOR {
                        $$ = {
                            nombre : "ASIGNACION",
                            hijos : [$1, $3]
                        };
                    };

SI              :   'if' '(' VALOR ')' 'then' '{' LCUERPO '}' ELSE {
                        $$ = {
                            nombre : "SI",
                            hijos : [$3, $7]
                        };
                        if($9 !== null)
                            $$.hijos.push($9);
                    };
ELSE            :   'else' '{' LCUERPO '}' { $$ = $3; }
                |   { $$ = null; };

SELECCION       :   'switch' '(' VALOR ',' VALOR ')' '{' LCASOS DEFECTO'}' {
                        $$ = {
                            nombre : "SELECCION",
                            hijos : [$3, $5, $8]
                        };
                        if($9 !== null)
                            $$.hijos.push($9);
                    };
LCASOS          :   LCASOS CASO {
                        $1.hijos.push($2);
                        $$ = $1;
                    }
                |   CASO {
                        $$ = {
                            nombre : "LCASOS",
                            hijos : [$1]
                        };
                    };
CASO            :   'case' VALOR ':' LCUERPO { $$ = { nombre : "CASO", hijos : [$2, $4]}; };
DEFECTO         :   'default' ':' LCUERPO { $$ = {nombre : "DEFECTO", hijos : [$3]}; }
                |   { $$ = null; };

MIENTRAS        :   'while' '(' VALOR ')' '{' LCUERPO '}' {
                        $$ = {
                            nombre : "MIENTRAS",
                            hijos : [$3, $6]
                        };
                    };

HACER           :   'do' '{' LCUERPO '}' 'while' '(' VALOR ')' {
                        $$ = {
                            nombre : "HACER",
                            hijos : [$3, $7]
                        };
                    };

REPETIR         :   'repeat' '{' LCUERPO '}' 'until' '(' VALOR ')' {
                        $$ = {
                            nombre : "REPETIR",
                            hijos : [$3, $7]
                        };
                    };

PARA            :   'for' '(' ASIGPARA ';' VALOR ';' ASIGNACION ')' '{' LCUERPO '}'{
                        $$ = {
                            nombre : "PARA",
                            hijos : [$3, $5, $7, $10]
                        };
                    };
ASIGPARA        :   ASIGNACION { $$ = $1; }
                |   num id ':' VALOR {
                        var lid = {nombre : "LID", hijos:[$2]};
                        var lvariables = {nombre : "LVARIABLES", hijos:[lid]};
                        $$ = {
                            nombre : "DECVAR",
                            tipo : $1,
                            hijos : [lvariables, $4]
                        };
                    };
LOOP            :   'loop' id '{' LCUERPO '}' {
                        $$ = {
                            nombre : "LOOP",
                            id : $2,
                            hijos : [$4]
                        };
                    };

CONTAR          :   'count' '(' VALOR ')' '{' LCUERPO '}' {
                        $$ = {
                            nombre : "CONTAR",
                            hijos : [$3, $6]
                        };
                    };

HACERX          :   'do' '{' LCUERPO '}' 'whilex' '(' VALOR ',' VALOR ')' {
                        $$ = {
                            nombre : "HACERX",
                            hijos : [$3, $7, $9]
                        };
                    };

LLAMADO         :   id '(' LVALOR ')' {
                        $$ = {
                            nombre : "LLAMADO",
                            hijos : [$1, $3]
                        };
                    }
                |   id '(' LVALOR ')' '.' LID{
                        $6.hijos.unshift({
                            nombre : "LLAMADO",
                            hijos : [$1, $3]
                        });
                        $$ = $6;
                    };

LVALOR          :   LVALOR ',' VALOR {
                        $1.hijos.push($2);
                        $$ = $1;
                    }
                |   VALOR { $$ = { nombre : "LVALOR", hijos : [$1] }; }
                |   { $$ = { nombre : "LVALOR", hijos : []}; };

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
                |   '-' E { $$ = {nombre :$1, hijos:[$2]}; }
                |   numero { $$ = {nombre : "numero", valor : $1}; }
                |   cadena { $$ = {nombre : "cadena", valor : $1}; }
                |   'true' { $$ = {nombre : "bool", valor : $1}; }
                |   'false' { $$ = {nombre : "bool", valor : $1}; }
                |   'NULL' { $$ = {nombre : "NULL", valor : $1}; }
                |   LID { $$ = $1; }
                |   LLAMADO { $$ = $1; }
                |   '(' VALOR ')' { $$ = $2; };

LID             :   LID '.' id {
                        $1.hijos.push($3);
                        $$ = $1;
                    }
                |   id { $$ = {nombre : "LID", hijos:[$1]}; };
