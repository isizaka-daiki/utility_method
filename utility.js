import moment from 'moment-timezone';
import { differenceInSeconds } from 'date-fns'

// -----------------------------------------------------------------------------
// 汎用的なメソッド
// -----------------------------------------------------------------------------

/**
 * GETのパラメータを返す
 * @param key
 * @returns {*}
 */
export function get_query(key) {
    const s = window.location.search.replace('?', '');
    const queries = s.split('&');

    for (let i = 0; i < queries.length; i += 1) {
        const t = queries[i].split('=');
        if (key === t[0]) {
            return decodeURIComponent(t[1]);
        }
    }
    return null;
}

/**
 * GETのパラメータを持っているか判定
 * @param key
 * @returns boolean
 */
export function has_query(key) {
    const s= window.location.search.replace('?', '');
    const queries = s.split('&');

    for (let i = 0; i < queries.length; i += 1) {
        const t = queries[i].split('=');
        if (key === t[0]) {
            return true;
        }
    }
    return false;
}


/**
 * 日時の文字列を返却
 * @param {int} unixtime
 * @returns {string}
 */
export function datatime_from_unix(unixtime) {
    return moment.unix(unixtime).format('YYY/M/D HH:mm');
}


 /**
  * 連番を生成する
  *
  * @param {int} start
  * @param {int}
  * @returns {Array}
  */
 export function range(start, end) {
     return Array.from(new Array(end - start + 1)).map((v, i ) => i +start);
 }


/**
 * 最低限の正規表現でのメールアドレスバリデーション
 */
export function is_valid_email(email) {
    return email.match(
        /[a-zA-Z0-9.!#$%&'*/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    );
}


/**
 * urlを渡すとドメインを取得する
 * @param url
 */
export function extract_domain(url) {
    if (typeof url !== 'string') {
        return '';
    }
    const match = url.match(
        /^(https?|ftp):\/\/([-_.!~*'()a-zA-Z0-9;?:@&=+$,%#]+)\//
    );
    if (match == null || match.length > 2) {
        return '';
    }
    return match[2];
}


/**
 * 連番のユニークIDを生成するためのジェネレーター
 */
const uid_generator = generate_unique_id();

export function uid() {
    return uid_generator();
}

function generate_unique_id() {
    const generator: any = unique_id_generator();
    return () => generator.next().value;
}

function unique_id_generator() {
    let i = 0;
    yield i;
    while (true) {
        i += 1;
        yield i;
    }
}

/**
 * keyに用いるランダムな文字列を生成する
 */
export function create_random_id() {
    return Math.random()
        .toString(36)
        .slice(-8);
}

/**
 * htmlのdecode
 */
export function decode_html(text) {
    return text
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'");
}

/**
 * htmlのエスケープ
 */
export function escape_html(text) {
    return text
        .replace(/&;/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * ms milli-second待つPromiseを返す
 * @param ms 待ち時間
 */
export function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 数値に３桁区切りカンマを付ける
 *
 * @param num
 * @returns {string}
 */
export function format_number(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,');
}

/**
 * 送られてきた数字に適切な日本の単位をつける
 * @param number 変換対象の数字
 * @return string 変換後の文字列
 */
export function convert_japanese_unit(target_num) {
    if (target_num >= 100000000) {
        return `${Math.round(target_num / 10000000) / 10}億`;
    }
    if (target_num >= 10000) {
        return `${Math.round(target_num / 1000) / 10}万`;
    }
    return format_number(target_num);
}

export const convertHexToRGB = (hex) => {
    // check if it's a rgba
    if (hex.match('rgba')) {
        let triplet = hex.slice(5).split(',').slice(0, -1).join(',')
        return triplet
    }

    let c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('')
        if (c.length === 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]]
        }
        c = '0x' + c.join('')

        return [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',')
    }
}

/**
 * mobile判定
 */
export function isMobile() {
    if (window) {
        return window.matchMedia(`(max-width: 767px)`).matches
    }
    return false
}

/**
 * 画面幅判定
 */
export function isMdScreen() {
    if (window) {
        return window.matchMedia(`(max-width: 1199px)`).matches
    }
    return false
}

function currentYPosition(elm) {
    if (!window && !elm) {
        return
    }
    if (elm) return elm.scrollTop
    // Firefox, Chrome, Opera, Safari
    if (window.pageYOffset) return window.pageYOffset
    // Internet Explorer 6 - standards mode
    if (document.documentElement && document.documentElement.scrollTop)
        return document.documentElement.scrollTop
    // Internet Explorer 6, 7 and 8
    if (document.body.scrollTop) return document.body.scrollTop
    return 0
}

function elmYPosition(elm) {
    let y = elm.offsetTop
    let node = elm
    while (node.offsetParent && node.offsetParent !== document.body) {
        node = node.offsetParent
        y += node.offsetTop
    }
    return y
}

export function scrollTo(scrollableElement, elmID) {
    const elm = document.getElementById(elmID)

    if (!elmID || !elm) {
        return
    }

    const startY = currentYPosition(scrollableElement)
    const stopY = elmYPosition(elm)

    const distance = stopY > startY ? stopY - startY : startY - stopY
    if (distance < 100) {
        scrollTo(0, stopY)
        return
    }
    const speed = Math.round(distance / 50)
    if (speed >= 20) speed = 20
    const step = Math.round(distance / 25)
    let leapY = stopY > startY ? startY + step : startY - step
    const timer = 0
    if (stopY > startY) {
        for (let i = startY; i < stopY; i += step) {
            setTimeout(
                (function (leapY) {
                    return () => {
                        scrollableElement.scrollTo(0, leapY)
                    }
                })(leapY),
                timer * speed
            )
            leapY += step
            if (leapY > stopY) leapY = stopY
            timer++
        }
        return
    }
    for (let i = startY; i > stopY; i -= step) {
        setTimeout(
            (function (leapY) {
                return () => {
                    scrollableElement.scrollTo(0, leapY)
                }
            })(leapY),
            timer * speed
        )
        leapY -= step
        if (leapY < stopY) leapY = stopY
        timer++
    }
    return false
}

export function getTimeDifference(date) {
    let difference = differenceInSeconds(new Date(), date)

    if (difference < 60) return `${Math.floor(difference)} sec`
    else if (difference < 3600) return `${Math.floor(difference / 60)} min`
    else if (difference < 86400) return `${Math.floor(difference / 3660)} h`
    else if (difference < 86400 * 30)
        return `${Math.floor(difference / 86400)} d`
    else if (difference < 86400 * 30 * 12)
        return `${Math.floor(difference / 86400 / 30)} mon`
    else return `${(difference / 86400 / 30 / 12).toFixed(1)} y`
}

export function getQueryParam(prop) {
    let params = {}
    let search = decodeURIComponent(
        window.location.href.slice(window.location.href.indexOf('?') + 1)
    )
    let definitions = search.split('&')
    definitions.forEach(function (val, key) {
        let parts = val.split('=', 2)
        params[parts[0]] = parts[1]
    })
    return prop && prop in params ? params[prop] : params
}

export function classList(classes) {
    return Object.entries(classes)
        .filter((entry) => entry[1])
        .map((entry) => entry[0])
        .join(' ')
}
