"""モン娘RPG の絵の道具で使う共通の関数。手順の正は docs/ART_PIPELINE.md"""
import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def char_dir(cid):
    return os.path.join(ROOT, 'assets', 'characters', cid)


def load_char(cid):
    path = os.path.join(char_dir(cid), 'character.json')
    with open(path, encoding='utf-8') as f:
        return json.load(f)


def save_char(cid, data):
    path = os.path.join(char_dir(cid), 'character.json')
    with open(path, 'w', encoding='utf-8') as f:
        f.write(json.dumps(data, ensure_ascii=False, indent=1) + '\n')


def pose_path(cid, data, pid):
    """character.json の poseFile（例 poses/myu_{id}_{name}.png）から、ポーズのファイルの場所を作る"""
    name = data.get('names', {}).get(pid, pid.lower())
    return os.path.join(char_dir(cid), data['poseFile'].format(id=pid, name=name))


# 全キャラ共通の16ポーズ（仕様書3章）。名前はキャラの character.json の names で変えてよい
DEFAULT_NAMES = {
    'P01': 'idle', 'P02': 'walk_a', 'P03': 'walk_b', 'P04': 'windup', 'P05': 'attack', 'P06': 'charge',
    'P07': 'special', 'P08': 'support', 'P09': 'guard', 'P10': 'hurt', 'P11': 'down', 'P12': 'after',
    'P13': 'taunt', 'P14': 'sexy', 'SP01': 'sp1', 'SP02': 'sp2',
}
