<?php
// app/Http/Controllers/MessageController.php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class MessageController extends Controller
{
    public function index()
    {
        Log::info('MessageController.index: Iniciando el método index.');

        $userId = Auth::id();
        Log::info("MessageController.index: ID del usuario autenticado: $userId");

        // Consulta de usuarios con conversaciones
        $usersWithMessages = User::whereHas('sentMessages', function ($query) use ($userId) {
            $query->where('receiver_id', $userId);
        })->orWhereHas('receivedMessages', function ($query) use ($userId) {
            $query->where('sender_id', $userId);
        })->with(['sentMessages' => function ($query) use ($userId) {
            $query->where('receiver_id', $userId)->latest()->limit(1);
        }, 'receivedMessages' => function ($query) use ($userId) {
            $query->where('sender_id', $userId)->latest()->limit(1);
        }])->get();

        Log::info('MessageController.index: Consulta de usuarios con mensajes realizada.', ['total_usuarios' => $usersWithMessages->count()]);

        $formattedUsers = $usersWithMessages->map(function ($user) use ($userId) {
            $lastSent = $user->sentMessages->first();
            $lastReceived = $user->receivedMessages->first();
            $lastMessage = null;

            if ($lastSent && $lastReceived) {
                $lastMessage = ($lastSent->created_at > $lastReceived->created_at) ? $lastSent : $lastReceived;
            } elseif ($lastSent) {
                $lastMessage = $lastSent;
            } elseif ($lastReceived) {
                $lastMessage = $lastReceived;
            }

            Log::info("MessageController.index: Procesando usuario.", ['usuario_id' => $user->id, 'nombre' => $user->name]);
            Log::debug("MessageController.index: Último mensaje procesado.", [
                'last_message' => $lastMessage ? [
                    'id' => $lastMessage->id,
                    'content' => $lastMessage->content,
                    'created_at' => $lastMessage->created_at->toDateTimeString(),
                    'is_sender' => $lastMessage->sender_id === $userId,
                ] : null
            ]);

            return [
                'id' => $user->id,
                'name' => $user->name,
                'last_message' => $lastMessage ? [
                    'content' => $lastMessage->content,
                    'created_at' => $lastMessage->created_at->toDateTimeString(),
                    'is_sender' => $lastMessage->sender_id === $userId,
                ] : null,
            ];
        });

        Log::info('MessageController.index: Usuarios formateados con éxito.', ['usuarios' => $formattedUsers->toArray()]);
        Log::info('MessageController.index: Renderizando la vista Messages/Index.');
        return Inertia::render('Messages/Index', [
            'users' => $formattedUsers,
        ]);
    }

    public function getMessages(User $user)
    {
        Log::info('MessageController.getMessages: Iniciando el método getMessages.', ['usuario_id' => $user->id]);

        $userId = Auth::id();
        Log::info("MessageController.getMessages: ID del usuario autenticado: $userId");

        $messages = Message::where(function ($query) use ($userId, $user) {
            $query->where('sender_id', $userId)->where('receiver_id', $user->id);
        })->orWhere(function ($query) use ($userId, $user) {
            $query->where('sender_id', $user->id)->where('receiver_id', $userId);
        })->with(['sender', 'receiver'])->orderBy('created_at', 'asc')->get();

        Log::info("MessageController.getMessages: Consulta de mensajes realizada.", ['total_mensajes' => $messages->count()]);

        $formattedMessages = $messages->map(function ($message) use ($userId) {
            Log::info("MessageController.getMessages: Procesando mensaje.", [
                'mensaje_id' => $message->id,
                'sender_id' => $message->sender_id,
                'receiver_id' => $message->receiver_id,
            ]);

            return [
                'id' => $message->id,
                'sender_id' => $message->sender_id,
                'sender_name' => $message->sender->name,
                'receiver_id' => $message->receiver_id,
                'receiver_name' => $message->receiver->name,
                'content' => $message->content,
                'created_at' => $message->created_at->toDateTimeString(),
                'read_at' => $message->read_at ? $message->read_at->toDateTimeString() : null,
                'is_sender' => $message->sender_id === $userId,
            ];
        });

        Log::info('MessageController.getMessages: Actualizando mensajes a leídos.');
        $updatedCount = Message::where('sender_id', $user->id)
            ->where('receiver_id', $userId)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);
        Log::info("MessageController.getMessages: Mensajes marcados como leídos.", ['total_actualizados' => $updatedCount]);

        Log::info('MessageController.getMessages: Mensajes formateados con éxito.', ['mensajes' => $formattedMessages->toArray()]);

        // Retorna la respuesta JSON
        return response()->json([
            'messages' => $formattedMessages,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
            ],
        ]);
    }

    public function getConversations()
    {
        Log::info('MessageController.getConversations: Iniciando el método getConversations.');

        $userId = Auth::id();
        Log::info("MessageController.getConversations: ID del usuario autenticado: $userId");

        // Consulta de usuarios con conversaciones
        $usersWithMessages = User::whereHas('sentMessages', function ($query) use ($userId) {
            $query->where('receiver_id', $userId);
        })->orWhereHas('receivedMessages', function ($query) use ($userId) {
            $query->where('sender_id', $userId);
        })->with(['sentMessages' => function ($query) use ($userId) {
            $query->where('receiver_id', $userId)->latest()->limit(1);
        }, 'receivedMessages' => function ($query) use ($userId) {
            $query->where('sender_id', $userId)->latest()->limit(1);
        }])->get();

        Log::info('MessageController.getConversations: Consulta de usuarios con mensajes realizada.', ['total_usuarios' => $usersWithMessages->count()]);

        $formattedUsers = $usersWithMessages->map(function ($user) use ($userId) {
            $lastSent = $user->sentMessages->first();
            $lastReceived = $user->receivedMessages->first();
            $lastMessage = null;

            if ($lastSent && $lastReceived) {
                $lastMessage = ($lastSent->created_at > $lastReceived->created_at) ? $lastSent : $lastReceived;
            } elseif ($lastSent) {
                $lastMessage = $lastSent;
            } elseif ($lastReceived) {
                $lastMessage = $lastReceived;
            }

            Log::info("MessageController.getConversations: Procesando usuario.", ['usuario_id' => $user->id, 'nombre' => $user->name]);

            return [
                'id' => $user->id,
                'name' => $user->name,
                'last_message' => $lastMessage ? [
                    'content' => $lastMessage->content,
                    'created_at' => $lastMessage->created_at->toDateTimeString(),
                    'is_sender' => $lastMessage->sender_id === $userId,
                ] : null,
            ];
        });

        Log::info('MessageController.getConversations: Usuarios formateados con éxito.', ['usuarios' => $formattedUsers->toArray()]);

        return response()->json([
            'users' => $formattedUsers,
        ]);
    }

    public function store(Request $request)
    {
        Log::info('MessageController.store: Iniciando el método store.', ['request' => $request->all()]);

        $validated = $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'content' => 'required|string',
        ]);

        Log::info('MessageController.store: Datos validados correctamente.', ['validated' => $validated]);

        try {
            $message = Message::create([
                'sender_id' => Auth::id(),
                'receiver_id' => $validated['receiver_id'],
                'content' => $validated['content'],
            ]);

            Log::info('MessageController.store: Mensaje creado con éxito.', ['mensaje_id' => $message->id]);

            return response()->json(['message' => $message->load('sender')]);
        } catch (\Exception $e) {
            Log::error('MessageController.store: Error al crear el mensaje.', [
                'exception' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'receiver_id' => $validated['receiver_id'],
                'content' => $validated['content'],
            ]);

            return response()->json(['error' => 'Hubo un error al guardar el mensaje.'], 500);
        }
    }

    public function markAsRead(Message $message)
    {
        Log::info('MessageController.markAsRead: Iniciando el método markAsRead.', ['mensaje_id' => $message->id]);

        if ($message->receiver_id !== Auth::id()) {
            Log::error('MessageController.markAsRead: El usuario no tiene permiso para marcar este mensaje como leído.', [
                'user_id' => Auth::id(),
                'receiver_id' => $message->receiver_id
            ]);
            abort(403);
        }

        $message->update(['read_at' => now()]);
        Log::info('MessageController.markAsRead: Mensaje marcado como leído con éxito.', ['mensaje_id' => $message->id]);

        return response()->json(['success' => true]);
    }
}
