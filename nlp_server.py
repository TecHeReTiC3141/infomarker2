from flask import Flask, request, jsonify
import pymorphy2

app = Flask(__name__)
morph = pymorphy2.MorphAnalyzer()


def find_first_noun_index(words):
    for word_index in range(len(words)):
        if morph.parse(words[word_index])[0].tag.POS == 'NOUN':
            return word_index
    return -1


def create_name_of_case(words_to_inflect: list[str],
                        words_not_to_inflect: list[str],
                        case: str) -> str:
    morphed_words = [morph.parse(word)[0].inflect({case}) for word in words_to_inflect]
    # Prepositions cant be morphed
    return ' '.join(
        [word.inflect({case}).word if word else words_to_inflect[i]
         for i, word in enumerate(morphed_words)] +
        words_not_to_inflect)


@app.route('/get_foreign_agent_variants', methods=['POST'])
def inflect():
    data = request.get_json()
    name, type = data['name'].replace("«", '"').replace("»", '"').replace("'", '"'), data['type']
    results = set()
    results.add(name)
    cases = ['nomn', 'gent', 'datv', 'accs', 'ablt', 'loct']

    if type == "ORGANISATION":
        # TODO: think about also adding the same with each sequence of words in the name (in the middle, suffix, prefix)
        first_noun = find_first_noun_index(name.replace('"', '').split())
        words_to_inflect, words_not_to_inflect = name.split()[:first_noun + 1], name.split()[first_noun + 1:]
        org_words_to_inflect, org_words_not_to_inflect = [], []
        has_org_name = '"' in name
        if has_org_name:
            org_name = name.split('"')[1].replace('"', '')
            first_noun = find_first_noun_index(org_name.split())
            org_words_to_inflect = org_name.split()[:first_noun + 1]
            org_words_not_to_inflect = org_name.split()[first_noun + 1:]

        for case in cases:
            results.add(create_name_of_case(words_to_inflect, words_not_to_inflect, case))
            if has_org_name:
                results.add(create_name_of_case(org_words_to_inflect, org_words_not_to_inflect, case))
    elif type == "PERSON":
        for case in cases:
            firstname, lastname, patronym = name.split()
            results.add(morph.parse(firstname)[0].inflect({case}).word)
            results.add(' '.join([morph.parse(word)[0].inflect({case}).word for word in name.split()]))

            results.add(
                morph.parse(firstname)[0].inflect({case}).word + ' ' + ''.join(
                    map(lambda x: x[0] + '.', name.split()[1:])))
            results.add(morph.parse(firstname)[0].inflect({case}).word + ' '
                        + morph.parse(lastname)[0].inflect({case}).word)
    return jsonify(sorted(results, key=lambda x: len(x), reverse=True))


if __name__ == '__main__':
    app.run(port=5000)
