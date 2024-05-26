from flask import Flask, request, jsonify
import pymorphy2

app = Flask(__name__)
morph = pymorphy2.MorphAnalyzer()


def find_first_noun_index(words):
    for word_index in range(len(words)):
        if morph.parse(words[word_index])[0].tag.POS == 'NOUN':
            return word_index
    return -1


@app.route('/get_foreign_agent_variants', methods=['POST'])
def inflect():
    data = request.get_json()
    name, type = data['name'].replace("'", '"'), data['type']
    results = [name]
    cases = ['nomn', 'gent', 'datv', 'accs', 'ablt', 'loct']

    if type == "ORGANISATION":

        # TODO: think about also adding the same with each sequence of words in the name (in the middle, suffix, prefix)
        first_noun = find_first_noun_index(name.replace('"', '').split())
        print(name, name.split()[first_noun + 1], name.split()[:first_noun + 1], name.split()[first_noun + 1:])
        abbrev = ''.join([word[0] for word in name.replace('"', "").split()]).upper()
        results.append(' ' + abbrev + ' ')
        words_to_inflect, words_not_to_inflect = name.split()[:first_noun + 1], name.split()[first_noun + 1:]
        for case in cases:
            print(words_to_inflect)
            for word in words_to_inflect:
                print(word, morph.parse(word)[0].inflect({case}).word)
            # print([morph.parse(word)[0].inflect({case}).word for word in name.split()[:first_noun + 1]], name.split()[first_noun + 1:])
            results.append(
                ' '.join([morph.parse(word)[0].inflect({case}).word for word in words_to_inflect] + words_not_to_inflect))
            inflected_abbrev = morph.parse(abbrev)[0].inflect({case})
            if inflected_abbrev:
                results.append(' ' + inflected_abbrev.word.upper() + ' ')

            if '"' in name:
                org_name = name.split('"')[1].replace('"', '')
                first_noun = find_first_noun_index(org_name.split())
                # print(name.split('"'), org_name, first_noun)
                results.append(' '.join([morph.parse(word)[0].inflect({case}).word for word
                                         in org_name.split()[:first_noun + 1]] + org_name.split()[first_noun + 1:]))
    elif type == "PERSON":
        for case in cases:
            firstname, lastname, patronym = name.split()
            results.append(morph.parse(firstname)[0].inflect({case}).word)
            results.append(' '.join([morph.parse(word)[0].inflect({case}).word for word in name.split()]))

            results.append(
                morph.parse(firstname)[0].inflect({case}).word + ' ' + ''.join(
                    map(lambda x: x[0] + '.', name.split()[1:])))
            results.append(morph.parse(firstname)[0].inflect({case}).word + ' '
                           + morph.parse(lastname)[0].inflect({case}).word)
    return jsonify(sorted(results, key=lambda x: len(x), reverse=True))


if __name__ == '__main__':
    app.run(port=5000)
