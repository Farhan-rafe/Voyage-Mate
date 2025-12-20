<?php

namespace App\Http\Controllers;

use App\Models\TripShareLink;
use App\Models\TripShareComment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SharedTripCommentController extends Controller
{
    public function store(Request $request, string $token)
    {
        $share = TripShareLink::active()
            ->where('token', $token)
            ->firstOrFail();

        $data = $request->validate([
            'name'  => 'required|string|max:120',
            'email' => 'nullable|email|max:190',
            'body'  => 'required|string|max:1000',
        ]);

        TripShareComment::create([
            'trip_share_link_id' => $share->id,
            'user_id'            => Auth::id(),
            'name'               => $data['name'],
            'email'              => $data['email'] ?? null,
            'body'               => $data['body'],
        ]);

        return redirect()
            ->route('share.show', $share->token)
            ->with('success', 'Comment posted.');
    }

    // ✅ EDIT / UPDATE comment
    public function update(Request $request, string $token, TripShareComment $comment)
    {
        $share = TripShareLink::active()
            ->where('token', $token)
            ->firstOrFail();

        // must belong to this share link
        abort_unless((int) $comment->trip_share_link_id === (int) $share->id, 404);

        // must be logged in + owner
        abort_unless(Auth::check(), 403);
        abort_unless((int) $comment->user_id === (int) Auth::id(), 403);

        $data = $request->validate([
            'body' => 'required|string|max:1000',
        ]);

        $comment->update([
            'body' => $data['body'],
        ]);

        return redirect()
            ->route('share.show', $share->token)
            ->with('success', 'Comment updated.');
    }

    // ✅ DELETE comment
    public function destroy(string $token, TripShareComment $comment)
    {
        $share = TripShareLink::active()
            ->where('token', $token)
            ->firstOrFail();

        // must belong to this share link
        abort_unless((int) $comment->trip_share_link_id === (int) $share->id, 404);

        // must be logged in + owner
        abort_unless(Auth::check(), 403);
        abort_unless((int) $comment->user_id === (int) Auth::id(), 403);

        $comment->delete();

        return redirect()
            ->route('share.show', $share->token)
            ->with('success', 'Comment deleted.');
    }
}
