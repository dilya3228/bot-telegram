const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} =require('./options')
const token = '6765301452:AAHlYztQOHwfSJZPTG0pfoepQt24RVF7clM'
const sequelize = require('./db')
const UserModel = require('./models')

const bot = new TelegramApi(token, {polling: true})

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Загадай чтсло от 1 до 9`)
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber
    await bot.sendMessage(chatId, `Отгадай число`, gameOptions)
}

const start = async() => {

    try {
        await sequelize.authenticate()
        await sequelize.sync()
    } catch(err) {
        console.log(`Подключение сломалось, ${err}`);
    }
    bot.setMyCommands([
        {command: '/start', description: 'Приветствие'},
        {command: '/info', description: 'Информация о боте'},
        {command: '/game', description: 'Играй угадай число'}
    ])


    bot.on('message', async msg => {
        const text = msg.text
        const chatId = msg.chat.id

        try {
            if(text === '/start'){
                await UserModel.create({chatId})
                await bot.sendSticker(chatId, 'https://chpic.su/_data/stickers/p/pigeons99/pigeons99_001.webp?v=1708074603')
                return bot.sendMessage(chatId, `Привет чурка`)
            }
            if(text === '/info'){
                const user = await UserModel.findOne({chatId})
                return bot.sendMessage(chatId, `Информация для чурок, твое новое имя Чурка${msg.from.username}, у тебя правильных ответов - ${user.right}, не правильный ответов - ${user.wrong}`)
            }
            if(text === '/game'){
               return startGame(chatId)
            }
            return bot.sendMessage(chatId, `Я тЭбя не понЫмать(`)
        } catch(err) {
            return bot.sendMessage(chatId, `Ошибкаааааа ${err}`)
        }   
    })
    bot.on('callback_query', async msg => {
        const data = msg.data
        const chatId = msg.message.chat.id
        if(data === '/again'){
            return startGame(chatId)
        }
        const user = await UserModel.findOne({chatId})

        if(data == chats[chatId]){
            user.right += 1;
            await bot.sendMessage(chatId, `Ты отгадал число ${chats[chatId]}`, againOptions)
        } else {
            user.wrong += 1;
            await bot.sendMessage(chatId, `Ну ты и чурка, это число - ${chats[chatId]}`, againOptions)
        }
        await user.save()
    })
}

start()