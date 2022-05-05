#!/usr/bin/env bash
DIRECTORIES=(
    "lexical" 
    # "lexical-react" 
    # "lexical-yjs" 
    # "lexical-list" 
    # "lexical-table" 
    # "lexical-file" 
    # "lexical-clipboard" 
    # "lexical-hashtag" 
    # "lexical-headless"
    # "lexical-history" 
    # "lexical-selection" 
    # "lexical-offset" 
    # "lexical-code" 
    # "lexical-mark"
    # "lexical-plain-text" 
    # "lexical-playground"
    # "lexical-rich-text" 
    # "lexical-utils" 
    # "lexical-dragon" 
    # "lexical-overflow" 
    # "lexical-link" 
    # "lexical-text" 
    # "lexical-markdown"
    # "shared"
)

for directory in ${DIRECTORIES[@]}; do
    for i in $(find ./packages/$directory -iname "*.js" -not -path "*__tests__*" -not -path "*dist*");
        do git mv "$i" "$(echo $i | rev | cut -d '.' -f 2- | rev).ts";
    done
    for i in $(find ./packages/$directory -iname "*.jsx" -not -path "*__tests__*" -not -path "*dist*");
        do git mv "$i" "$(echo $i | rev | cut -d '.' -f 2- | rev).tsx";
    done

    for i in $(find ./packages/$directory -iname "*.ts" -not -path "*__tests__*" -not -path "*dist*");
        do @khanacademy/flow-to-ts --write --delete-source "**/*.ts";
    done
    for i in $(find ./packages/$directory -iname "*.tsx" -not -path "*__tests__*" -not -path "*dist*");
        do @khanacademy/flow-to-ts --write --delete-source "**/*.tsx";
    done

    for i in $(find ./packages/$directory -iname "*.ts" -not -path "*__tests__*" -not -path "*dist*" -not -path "flow");
        do sed -i "" "s/boolean %checks/node is LexicalNode/g" $i && sed -i "" "s/: LexicalNode>/ = LexicalNode>/g" $i;
    done
    for i in $(find ./packages/$directory -iname "*.tsx" -not -path "*__tests__*" -not -path "*dist*" -not -path "flow");
        do sed -i "" "s/boolean %checks/node is LexicalNode/g" $i && sed -i "" "s/: LexicalNode>/ = LexicalNode>/g" $i;
    done
done

npm run prettier:fix;