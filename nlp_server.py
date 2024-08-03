import logging
from typing import Callable

from flask import Flask, request, jsonify
import pymorphy2
from pymorphy2.analyzer import Parse

app = Flask(__name__)
morph = pymorphy2.MorphAnalyzer()


def find_first_noun_index(words):
    for word_index in range(len(words)):
        if morph.parse(words[word_index])[0].tag.POS == 'NOUN':
            return word_index
    return -1


def morph_org_to_case(words_to_inflect: list[str],
                      words_not_to_inflect: list[str],
                      case: str) -> str:
    morphed_words = [morph.parse(word)[0].inflect({case}) for word in words_to_inflect]
    # Prepositions cant be morphed
    return ' '.join(
        [word.inflect({case}).word if word else words_to_inflect[i]
         for i, word in enumerate(morphed_words)] +
        words_not_to_inflect)


# Not all parts cant be morphed (example: Дзядко, Шац, Дудь)
def inflect_name_part(name_part_parse: Parse, case: str) -> str:
    inflected_name_part = name_part_parse.inflect({case})
    return inflected_name_part.word if inflected_name_part else name_part_parse.word


def get_person_gender(surname_parse: Parse,
                      name_parse: Parse,
                      patronym_parse: Parse) -> str:
    get_gender: Callable[[Parse, ], str] = lambda parse: parse.tag.gender
    gender = get_gender(surname_parse)
    if not gender:
        gender = get_gender(name_parse)
    if not gender:
        gender = get_gender(patronym_parse)
    return gender


def get_person_parse(surname: str,
                     name: str,
                     patronym: str) -> tuple[Parse, Parse, Parse]:
    surname_parse_list: list[Parse] = list(filter(
        lambda surname_parse: "Surn" in str(surname_parse.tag),
        morph.parse(surname)
    ))
    name_parse_list: list[Parse] = list(filter(
        lambda name_parse: "Name" in str(name_parse.tag),
        morph.parse(name)
    ))
    patronym_parse_list: list[Parse] = list(filter(
        lambda patronym_parse: "Patr" in str(patronym_parse.tag),
        morph.parse(patronym)
    ))
    if not all([surname_parse_list, name_parse_list, patronym_parse_list]):
        logging.warning(f"Person name part was not find: {surname}, {name}, {patronym}")
        return (surname_parse_list[0] if len(surname_parse_list) else morph.parse(surname)[0],
                name_parse_list[0] if len(name_parse_list) else morph.parse(name)[0],
                patronym_parse_list[0] if len(patronym_parse_list) else morph.parse(patronym)[0])

    person_gender = get_person_gender(surname_parse_list[0], name_parse_list[0], patronym_parse_list[0])
    if not person_gender:
        logging.warning(f'Person gender not found: {surname}, {name}, {patronym}')
        return surname_parse_list[0], name_parse_list[0], patronym_parse_list[0]

    filter_by_gender = lambda parse: parse.tag.gender == person_gender
    surname_parse_list = list(filter(filter_by_gender, surname_parse_list))
    name_parse_list = list(filter(filter_by_gender, name_parse_list))
    patronym_parse_list = list(filter(filter_by_gender, patronym_parse_list))
    if not all([surname_parse_list, name_parse_list, patronym_parse_list]):
        logging.warning(f"Person name part was not find: {surname}, {name}, {patronym}")
        return (surname_parse_list[0] if len(surname_parse_list) else morph.parse(surname)[0],
                name_parse_list[0] if len(name_parse_list) else morph.parse(name)[0],
                patronym_parse_list[0] if len(patronym_parse_list) else morph.parse(patronym)[0])

    return surname_parse_list[0], name_parse_list[0], patronym_parse_list[0]


def morph_name_to_case(surname_parse: Parse,
                       name_parse: Parse,
                       patronym_parse: Parse,
                       case: str) -> list[str]:
    inflected_surname = inflect_name_part(surname_parse, case)
    inflected_name = inflect_name_part(name_parse, case)
    inflected_patronym = inflect_name_part(patronym_parse, case)
    return [
        inflected_surname,  # Иванов
        ' '.join([inflected_surname, inflected_name, inflected_patronym]),  # Иванов Иван Иванович
        ' '.join([inflected_name, inflected_patronym, inflected_surname]),  # Иван Иванович Иванов
        f"{inflected_surname} {name_parse.word[0]}.{patronym_parse.word[0]}.",  # Иванов И.И.
        inflected_surname + " " + inflected_name,  # Иванов Иван
        inflected_name + " " + inflected_surname,  # Иван Иванов
        inflected_name + " " + inflected_patronym  # Иван Иванович
    ]


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
            results.add(morph_org_to_case(words_to_inflect, words_not_to_inflect, case))
            if has_org_name:
                results.add(morph_org_to_case(org_words_to_inflect, org_words_not_to_inflect, case))
    elif type == "PERSON":
        surname, name, patronym = name.split()
        surname_parse, name_parse, patronym_parse = get_person_parse(surname, name, patronym)

        for case in cases:
            results.update(morph_name_to_case(surname_parse, name_parse, patronym_parse, case))
    return jsonify(sorted(results, key=lambda x: len(x), reverse=True))


if __name__ == '__main__':
    app.run(port=5000)
