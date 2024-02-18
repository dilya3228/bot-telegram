const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} =require('./options')
const token = '6765301452:AAHlYztQOHwfSJZPTG0pfoepQt24RVF7clM'

const bot = new TelegramApi(token, {polling: true})

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Загадай чтсло от 1 до 9`)
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber
    await bot.sendMessage(chatId, `Отгадай число`, gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Приветствие'},
        {command: '/info', description: 'Информация о боте'},
        {command: '/game', description: 'Играй угадай число'}
    ])
    
    bot.on('message', async msg => {
        const text = msg.text
        const chatId = msg.chat.id
    
        if(text === '/start'){
            await bot.sendSticker(chatId, 'https://chpic.su/_data/stickers/p/pigeons99/pigeons99_001.webp?v=1708074603')
            return bot.sendMessage(chatId, `Привет чурка`)
        }
        if(text === '/info'){
            return bot.sendMessage(chatId, `Информация для чурок, твое новое имя Чурка${msg.from.username}`)
        }
        if(text === '/game'){
           return startGame(chatId)
        }
        return bot.sendMessage(chatId, `Я тЭбя не понЫмать(`)
    })
    bot.on('callback_query', msg => {
        const data = msg.data
        const chatId = msg.message.chat.id
        if(data === '/again'){
            return startGame(chatId)
        }
        if(data === chats[chatId]){
            return bot.sendMessage(chatId, `Ты отгадал число ${chats[chatId]}`, againOptions)
        } else {
            return bot.sendMessage(chatId, `Ну ты и чурка, это число - ${chats[chatId]}`, againOptions)
        }
    })
}

start()