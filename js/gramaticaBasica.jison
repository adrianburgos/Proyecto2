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

"getBool"                                               return 'getBool'
"getNum"                                                return 'getNum'
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

CUERPOGEN       :   PRINCIPAL { $$ = $1; };

DECVAR          :   TIPO LVARIABLES ASIG {
                        $$ = {
                            nombre : "DECVAR",
                            tipo : $1,
                            hijos : [$2, $3]
                        };
                    };
ASIG            :   ':' VALOR { $$ = $2; }
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

TIPO            :   'num' { $$ = $1; }
                |   'str' { $$ = $1; }
                |   'bool' { $$ = $1; };

PRINCIPAL       :   'principal' '(' ')' '{' LCUERPO '}' { $$ = {nombre : "PRINCIPAL", hijos : [$5]}; }
                |   'principal' '(' ')' '{' '}' { $$ = {nombre : "PRINCIPAL", hijos : [{nombre : "LCUERPO", hijos:[]}]}; };

LCUERPO         :   LCUERPO CUERPO {
                        $1.hijos.push($2);
                        $$ = $1;
                    }
                |   CUERPO { $$ = {nombre : "LCUERPO", hijos:[$1]}; };

CUERPO          :   ASIGNACION ';' { $$ = $1; }
                |   DECVAR ';'{ $$ = $1; }
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
                |   ESTANDARVALOR  ';' { $$ = $1; }
                |   ESTANDARVOID  ';' { $$ = $1; }
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
                    }
                |   LID '=' ;

SI              :   'if' '(' VALOR ')' '{' LCUERPO '}' ELSE {
                        $$ = {
                            nombre : "SI",
                            hijos : [$3, $6]
                        };
                        if($8 !== null)
                            $$.hijos.push($8);
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
                        $1.hijos.push($3);
                        $$ = $1;
                    }
                |   VALOR { $$ = { nombre : "LVALOR", hijos : [$1] }; }
                |   { $$ = { nombre : "LVALOR", hijos : []}; };

ESTANDARVALOR   :   'getBool' '(' VALOR ')' { $$ = { nombre : "getBool", hijos : [$3] }; }
                |   'getLength' '(' VALOR ')' { $$ = { nombre : "getLength", hijos : [$3] }; }
                |   'inNum' '(' VALOR ',' VALOR ')' { $$ = { nombre : "inNum", hijos : [$3, $5] }; };
ESTANDARVOID    :   'outStr' '(' VALOR ')' { $$ = { nombre : "outStr", hijos : [$3] }; }
                |   'outNum' '(' VALOR ',' VALOR ')' { $$ = { nombre : "outNum", hijos : [$3, $5] }; }
                |   'inStr' '(' LID ',' VALOR ')' { $$ = { nombre : "inStr", hijos : [$3, $5] }; };

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
                |   ESTANDARVALOR { $$ = $1; }
                |   LID { $$ = $1; }
                |   LLAMADO { $$ = $1; }
                |   '(' VALOR ')' { $$ = $2; };

LID             :   LID '.' id {
                        $1.hijos.push($3);
                        $$ = $1;
                    }
                |   id { $$ = {nombre : "LID", hijos:[$1]}; };
